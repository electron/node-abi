import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url';

import semver from 'semver'

function sortByElectronVersionFn (a, b) {
  const modulesComp = Number(a.modules) - Number(b.modules)
  if (modulesComp !== 0) return modulesComp
  if (semver.lt(a.version, b.version)) return 1
  if (semver.gt(a.version, b.version)) return -1
  return 0
}

function sortByNodeVersionFn (a, b) {
  const abiComp = Number(a.abi) - Number(b.abi)
  if (abiComp !== 0) return abiComp
  if (semver.lt(a.target, b.target)) return 1
  if (semver.gt(a.target, b.target)) return -1
  return 0
}

async function getJSONFromCDN (urlPath) {
  return fetch(`https://cdn.jsdelivr.net/gh/${urlPath}`).then((resp) => resp.json())
}

async function fetchElectronReleases () {
  return fetch(`https://electronjs.org/headers/index.json`).then((resp) => resp.json())
}

async function fetchNodeVersions () {
  const schedule = await getJSONFromCDN('nodejs/Release@main/schedule.json')
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
  return (await getJSONFromCDN('nodejs/node@main/doc/abi_version_registry.json'))
    .NODE_MODULE_VERSION
    .filter(({ modules }) => modules > 66)
}

function electronReleasesToTargets (releases) {
  const versions = releases.map(({ version }) => version)
  const versionsByModules = releases
    .filter(release => Number(release.modules) >= 70)
    .map(({ version, modules }) => ({
      version,
      modules,
    }))
    .filter(({ version }) => !version.includes('nightly'))
    .sort(sortByElectronVersionFn)
    .reduce(
      (acc, { modules, version }) => ({
        ...acc,
        [`${version.split('.')[0]}-${modules}`]: {
          version,
          modules,
        }
      }),
      {}
    )

    return Object.entries(versionsByModules)
      .map(
        ([major, {version, modules}]) => ({
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

function nodeVersionsToTargets (abiVersions, nodeVersions) {
  return Object.values(
    abiVersions
      .filter(({ runtime }) => runtime === 'node')
      .reduce(
        (acc, abiVersion) => {
          const { version: nodeVersion } = semver.coerce(abiVersion.versions)

          return {
            [nodeVersion]: {
              ...nodeVersions[nodeVersion],
              abi: abiVersion.modules.toString(),
            },
            ...acc,
          };
        },
        {}
      )
  ).sort(sortByNodeVersionFn)
}

async function main () {
  const nodeVersions = await fetchNodeVersions()
  const abiVersions = await fetchAbiVersions()
  const electronReleases = await fetchElectronReleases()
  const electronTargets = electronReleasesToTargets(electronReleases)
  const nodeTargets = nodeVersionsToTargets(abiVersions, nodeVersions)
  const supportedTargets = [
    ...nodeTargets,
    ...electronTargets,
  ]

  await writeFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'abi_registry.json'), JSON.stringify(supportedTargets, null, 2))
}

main()
