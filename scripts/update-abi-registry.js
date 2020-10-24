const got = require('got')
const path = require('path')
const semver = require('semver')
const { writeFile } = require('fs').promises

async function getJSONFromCDN (urlPath) {
  const response = await got(`https://cdn.jsdelivr.net/gh/${urlPath}`)
  return JSON.parse(response.body)
}

async function fetchElectronReleases () {
  return (await getJSONFromCDN('electron/releases/lite.json'))
}

async function fetchNodeVersions () {
  const schedule = await getJSONFromCDN('nodejs/Release/schedule.json')
  const versions = {}

  for (const [majorVersion, metadata] of Object.entries(schedule)) {
    if (majorVersion.startsWith('v0')) {
      continue
    }
    const version = `${majorVersion.slice(1)}.0.0`
    const lts = metadata.hasOwnProperty('lts') ? [metadata.lts, metadata.maintenance] : false
    versions[version] = {
      runtime: 'node',
      target: version,
      lts: lts,
      future: new Date(Date.parse(metadata.start)) > new Date()
    }
  }

  return versions
}

async function fetchAbiVersions () {
  return (await getJSONFromCDN('nodejs/node/doc/abi_version_registry.json'))
    .NODE_MODULE_VERSION
    .filter(({ modules }) => modules > 66)
}

function electronTargetsByModules(releases) {
  const versions = releases.map(({ version }) => version)
  const versionsByModules = releases
    .filter(release => release.deps && Number(release.deps.modules) >= 70)
    .map(({ version, deps: { modules } }) => ({
      version,
      modules,
    }))
    .reduce(
      (acc, { modules, version }) => ({
        ...acc,
        [modules]: version,
      }),
      {}
    )

    return Object.entries(versionsByModules)
      .map(
        ([modules, version]) => ({
          abi: modules,
          future: !versions.find(
            v => {
              const major = version.split(".")[0]
              return semver.satisfies(
                v,
                /^[0-9]/.test(major) ? `>= ${major}` : major
              )
            }
          ),
          lts: false,
          runtime: 'electron',
          target: version
        })
      )
}

async function main () {
  const nodeVersions = await fetchNodeVersions()
  const abiVersions = await fetchAbiVersions()
  const electronReleases = await fetchElectronReleases()
  const electronTargets = electronTargetsByModules(electronReleases)

  const abiVersionSet = new Set()
  const supportedTargets = []
  for (const abiVersion of abiVersions) {
    let target
    if (abiVersion.runtime === 'node') {
      const nodeVersion = abiVersion.versions.replace('-pre', '')
      target = nodeVersions[nodeVersion]
      if (!target) {
        continue
      }
    } else {
      target = {
        runtime: abiVersion.runtime === 'nw.js' ? 'node-webkit' : abiVersion.runtime,
        target: abiVersion.versions,
        lts: false,
        future: false
      }
      if (target.runtime === 'electron') {
        continue
      }
    }

    const key = [target.runtime, target.target].join('-')
    if (abiVersionSet.has(key)) {
      continue
    }

    abiVersionSet.add(key)
    supportedTargets.unshift({
      ...target,
      abi: abiVersion.modules.toString()
    })
  }

  for (const electronTarget of electronTargets) {
    supportedTargets.push(electronTarget)
  }

  await writeFile(path.resolve(__dirname, '..', 'abi_registry.json'), JSON.stringify(supportedTargets, null, 2))
}

main()
