import makeRegExp from 'regexgen';

const prefixGroups = {
  'China Mobile': [
    1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 135, 136, 137, 138,
    139, 150, 151, 152, 157, 158, 159, 178, 182, 183, 184, 187, 188, 198,
  ],
  'China Mobile (MVNO)': [1703, 1705, 1706],
  // "China Mobile (Data-only)": [1440, 147, 148],

  'China Unicom': [130, 131, 132, 155, 156, 166, 175, 176, 185, 186],
  'China Unicom (MVNO)': [1704, 1707, 1708, 1709, 171],
  // "China Unicom (Data-only)": [145, 146],

  'China Telecom': [133, 153, 173, 177, 180, 181, 189, 199],
  'China Telecom (MVNO)': [1700, 1701, 1702],
  // "China Telecom (Data-only)": [149, 1410],
  // "China Telecom (Satellite)": [1349, 17400, 17401, 17402, 17403, 17404, 17405]
};

function buildRegExp(prefixs: number[]) {
  prefixs.sort();
  const mapped = prefixs.map(String).map((prefix) => prefix.padEnd(11, 'X'));
  const replaced = makeRegExp(mapped)
    .source.replace(/\[0-9]/g, 'X')
    .replace(/X+/g, (m) => `\\d{${m.length}}`)
    .replace(/\\d\{1}/g, '\\d');
  return new RegExp(`^${replaced}$`);
}

function makeSingleRegExp(prefixGroups: Record<string, number[]>) {
  const prefixs = Object.values(prefixGroups).reduce(
    (prefixs, items) => [...prefixs, ...items],
    [],
  );
  return buildRegExp(prefixs);
}

function makeGroupRegExp(prefixGroups: Record<string, number[]>) {
  return Object.keys(prefixGroups).reduce((group, name) => {
    return Object.assign(group, { [name]: buildRegExp(prefixGroups[name]) });
  }, {});
}

console.log('Single RegExp:\n');
console.log(makeSingleRegExp(prefixGroups));

console.log(`\n${'-'.repeat(20)}\n`);

console.log('Group RegExp:\n');
console.log(makeGroupRegExp(prefixGroups));
