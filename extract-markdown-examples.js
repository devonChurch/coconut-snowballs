module.exports = data => {
  const matches = data.match(/(```)(.|\n)*?(```)/g);

  return (matches || []).map(match => {
    const lines = match.split("\n").filter(line => !/```/.test(line));
    return lines.join("\n");
  });
};
