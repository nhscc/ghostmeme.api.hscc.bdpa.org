# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits][1], and this project adheres to
[Semantic Versioning][2].

# 1.1.0 (2021-07-28)

### Bug Fixes

- **prune-data.ts:** more helpful error output ([1f8d01f][3])
- Allow itemExists case-insensitive searches ([26b8bf6][4])
- Better env error messages ([dcac26d][5])
- Env includes DEBUG now ([b2a5426][6])
- **db.ts:** selectively require dev-deps instead of import ([e22155c][7])
- **dependabot.yml:** fix dependabot branch targeting ([df185ab][8])
- **env.ts:** remove colon from timezone ([6a3599b][9])
- **index.ts:** additional validation check for imageBase64 ([ea170bf][10])
- **index.ts:** allow for search matches involving null ([7772542][11])
- **index.ts:** better property checks for creation operations ([335eb2c][12])
- **index.ts:** error message typo ([e27dfb8][13])
- Adopt itemExists fix from barker ([f796481][14])
- Use proper metadata keys ([9a86c4a][15])
- **next.config.js:** ignore eslint during builds ([64edfcf][16])
- **package.json:** split off deps from dev-deps ([182da6e][17])
- **webpack.config.js:** import threads-plugin properly ([7792308][18])

### Build System

- **deps:** bump @types/mongodb from 3.6.19 to 3.6.20 ([32a49ef][19])
- **deps:** bump @typescript-eslint/eslint-plugin from 4.28.1 to 4.28.2
  ([a655f46][20])
- **deps:** bump @typescript-eslint/parser from 4.28.1 to 4.28.2 ([e4dd0a9][21])
- **deps:** bump mongodb-memory-server from 6.9.6 to 7.1.0 ([b5493a0][22])
- **deps:** bump webpack from 5.42.0 to 5.42.1 ([2b2bd63][23])

### Features

- Add more debug info to index page ([0f19688][24])
- More versatile prune-data external ([51b8f28][25])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/1f8d01f3256e05728773d64573f2ebf71223507f
[4]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/26b8bf6ea12e203370ede5cc5129276b9f54786a
[5]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/dcac26d02ee0ec9d77a04e92098c8770d12c70e4
[6]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/b2a54265df49c602cb6fb5cd6a65f1a9aa9ac20d
[7]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/e22155c75ef918c7a1eab9cfaa2b106386957ed1
[8]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/df185abb5bb1168847ae82011be7c5824d16621b
[9]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/6a3599b7da333fc2eb9f6bea4fd1f270b6247b3b
[10]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/ea170bfcb230da5b00f898ed66c1e50032970fc5
[11]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/777254201b902be60ce55eab6967f98793c3afd3
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/335eb2c3966fb9a6ed4b13b28550c3801c773f6b
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/e27dfb8c6ed2f66fc47cbc995389113984a2daba
[14]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/f7964816717dc0344764d0affc579524fb7ede38
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/9a86c4a35ade85c080317b951983ac1906bb8578
[16]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/64edfcf1bbe4026e92dd360e9abf024306e3b72c
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/182da6e062067fa2d57a0a38cc84bf17abbcf5ef
[18]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/7792308e448f40001098bc1be5eadb15bc820176
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/32a49efd2359f01959b8dcb0a4b0cbd15dad3b08
[20]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/a655f46bc29106759c6faf50b8a4be166f2c5b6b
[21]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/e4dd0a98414982c8f0a675f81ff7b4469fa9b87b
[22]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/b5493a0df1c2e427768067ab6bb4a88d38b5e50c
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/2b2bd638ffdd324aca15ef3329a647df5a6ff07c
[24]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/0f19688a551bb223adb3cdcbd8213b633b74d322
[25]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/51b8f286d72793fb66e5649c97b5ad57b1cade3c
