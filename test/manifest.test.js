const test = require('ava')
const tutil = require('./util')
const pda = require('../index')

test('read/write/update manifest', async t => {
  var archive = await tutil.createArchive([])
  await new Promise(resolve => archive.ready(resolve))

  await pda.writeManifest(archive, {
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    title: 'My DWeb',
    description: 'This dweb has a manifest!',
    type: 'foo bar',
    links: {repository: 'https://github.com/distributedweb/dbrowser-dweb-api.git'},
    author: {
      name: 'Bob',
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  t.deepEqual(await pda.readManifest(archive), {
    title: 'My DWeb',
    description: 'This dweb has a manifest!',
    type: ['foo', 'bar'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      name: 'Bob',
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  await pda.updateManifest(archive, {
    title: 'My DWeb!!',
    type: 'foo'
  })

  t.deepEqual(await pda.readManifest(archive), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      name: 'Bob',
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  await pda.updateManifest(archive, {
    author: 'Robert'
  })

  t.deepEqual(await pda.readManifest(archive), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      name: 'Robert'
    }
  })

  await pda.updateManifest(archive, {
    author: 'dweb://ffffffffffffffffffffffffffffffff'
  })

  t.deepEqual(await pda.readManifest(archive), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  // should ignore bad well-known values
  // but leave others alone
  await pda.updateManifest(archive, {
    author: true,
    foobar: true
  })

  t.deepEqual(await pda.readManifest(archive), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    },
    foobar: true
  })
})

test('read/write/update manifest w/fs', async t => {
  var fs = await tutil.createFs([])

  await pda.writeManifest(fs, {
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    title: 'My DWeb',
    description: 'This dweb has a manifest!',
    type: 'foo bar',
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    author: {
      name: 'Bob',
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  t.deepEqual(await pda.readManifest(fs), {
    title: 'My DWeb',
    description: 'This dweb has a manifest!',
    type: ['foo', 'bar'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      name: 'Bob',
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  await pda.updateManifest(fs, {
    title: 'My DWeb!!',
    type: 'foo'
  })

  t.deepEqual(await pda.readManifest(fs), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      name: 'Bob',
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })

  await pda.updateManifest(fs, {
    author: 'Robert'
  })

  t.deepEqual(await pda.readManifest(fs), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      name: 'Robert'
    }
  })

  await pda.updateManifest(fs, {
    author: 'dweb://ffffffffffffffffffffffffffffffff'
  })

  t.deepEqual(await pda.readManifest(fs), {
    title: 'My DWeb!!',
    description: 'This dweb has a manifest!',
    type: ['foo'],
    links: {repository: [{href: 'https://github.com/distributedweb/dbrowser-dweb-api.git'}]},
    url: `dweb://${tutil.FAKE_DAT_KEY}`,
    author: {
      url: 'dweb://ffffffffffffffffffffffffffffffff'
    }
  })
})
