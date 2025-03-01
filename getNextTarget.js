import semver from 'semver';

export function getNextTarget (runtime, targets) {
  const latest = targets.filter((t) => { return t.runtime === runtime }).slice(-1)[0]
  const increment = runtime === 'electron' ? 'minor' : 'major'
  let next = semver.inc(latest.target, increment)
  // Electron releases appear in the registry in their beta form, sometimes there is
  // no active beta line.  During this time we need to double bump
  if (runtime === 'electron' && semver.parse(latest.target).prerelease.length) {
    next = semver.inc(next, 'major')
  }
  return next
}
