# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits][1], and this project adheres to
[Semantic Versioning][2].

# 1.1.0 (2021-08-07)

### Bug Fixes

- **prune-data.ts:** log goes to stdout ([60b2ea4][3])
- **prune-data.ts:** more helpful error output ([1f8d01f][4])
- Allow itemExists case-insensitive searches ([26b8bf6][5])
- Better env error messages ([dcac26d][6])
- Env includes DEBUG now ([b2a5426][7])
- **db.ts:** selectively require dev-deps instead of import ([e22155c][8])
- **dependabot.yml:** fix dependabot branch targeting ([df185ab][9])
- **env.ts:** remove colon from timezone ([6a3599b][10])
- **index.ts:** additional validation check for imageBase64 ([ea170bf][11])
- **index.ts:** allow for search matches involving null ([7772542][12])
- **index.ts:** better property checks for creation operations ([335eb2c][13])
- **index.ts:** error message typo ([e27dfb8][14])
- Adopt itemExists fix from barker ([f796481][15])
- Use proper metadata keys ([9a86c4a][16])
- **next.config.js:** ignore eslint during builds ([64edfcf][17])
- **package.json:** split off deps from dev-deps ([182da6e][18])
- **webpack.config.js:** import threads-plugin properly ([7792308][19])

### Build System

- **.vercelignore:** add more restrictions ([b8af35d][20])
- **.vercelignore:** do not upload files under /test to vercel ([4bab606][21])
- **.vercelignore:** do not upload large or irrelevant files to vercel
  ([9b46494][22])
- **.vercelignore:** unrestrict expect-env for now ([de4c71f][23])
- Modernize build process ([34948c4][24])
- **deps:** bump @types/mongodb from 3.6.19 to 3.6.20 ([32a49ef][25])
- **deps:** bump @typescript-eslint/eslint-plugin from 4.28.1 to 4.28.2
  ([a655f46][26])
- **deps:** bump @typescript-eslint/parser from 4.28.1 to 4.28.2 ([e4dd0a9][27])
- **deps:** bump mongodb-memory-server from 6.9.6 to 7.1.0 ([b5493a0][28])
- **deps:** bump webpack from 5.42.0 to 5.42.1 ([2b2bd63][29])

### Features

- Add new imgur-based image upload functionality ([b50e614][30])
- **\_example.ts:** add example external script ([dbde825][31])
- Add more debug info to index page ([0f19688][32])
- More versatile prune-data external ([51b8f28][33])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/60b2ea431bc1e2e7a9f04fcf989b462a55b98daa
[4]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/1f8d01f3256e05728773d64573f2ebf71223507f
[5]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/26b8bf6ea12e203370ede5cc5129276b9f54786a
[6]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/dcac26d02ee0ec9d77a04e92098c8770d12c70e4
[7]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/b2a54265df49c602cb6fb5cd6a65f1a9aa9ac20d
[8]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/e22155c75ef918c7a1eab9cfaa2b106386957ed1
[9]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/df185abb5bb1168847ae82011be7c5824d16621b
[10]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/6a3599b7da333fc2eb9f6bea4fd1f270b6247b3b
[11]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/ea170bfcb230da5b00f898ed66c1e50032970fc5
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/777254201b902be60ce55eab6967f98793c3afd3
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/335eb2c3966fb9a6ed4b13b28550c3801c773f6b
[14]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/e27dfb8c6ed2f66fc47cbc995389113984a2daba
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/f7964816717dc0344764d0affc579524fb7ede38
[16]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/9a86c4a35ade85c080317b951983ac1906bb8578
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/64edfcf1bbe4026e92dd360e9abf024306e3b72c
[18]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/182da6e062067fa2d57a0a38cc84bf17abbcf5ef
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/7792308e448f40001098bc1be5eadb15bc820176
[20]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/b8af35db8e1cd14d64954ba2c0434ea7a6dd256e
[21]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/4bab606593c863b034bab9b229ee4d658ad494a4
[22]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/9b4649495a917f5cf66e18defb2fa48013f700f3
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/de4c71f10bf213a5b814a0533434c5029b6e209d
[24]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/34948c417ae0466c4612d50541a7ac3450fb8258
[25]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/32a49efd2359f01959b8dcb0a4b0cbd15dad3b08
[26]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/a655f46bc29106759c6faf50b8a4be166f2c5b6b
[27]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/e4dd0a98414982c8f0a675f81ff7b4469fa9b87b
[28]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/b5493a0df1c2e427768067ab6bb4a88d38b5e50c
[29]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/2b2bd638ffdd324aca15ef3329a647df5a6ff07c
[30]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/b50e614027638cee945b34a9b3d0e62b84feaf0f
[31]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/dbde825516db40a293b74dafec61365f70248cdc
[32]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/0f19688a551bb223adb3cdcbd8213b633b74d322
[33]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/commit/51b8f286d72793fb66e5649c97b5ad57b1cade3c
