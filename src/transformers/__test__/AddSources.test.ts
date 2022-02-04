import { promises as fs } from 'fs'
import AddSources from '../AddSources'
import path from 'path'
import { noopLogger } from '../../Logger'

test('AddSources transformer: typescript example', async () => {
  const projectRoot = path.join(__dirname, 'fixtures', 'typescript')
  const absolutePath = path.join(projectRoot, 'dist', 'out.js.map')
  const sourceMapJson = JSON.parse(await fs.readFile(absolutePath, 'utf-8'))
  await AddSources(absolutePath, sourceMapJson, projectRoot, noopLogger)
  expect(sourceMapJson.sourcesContent).toStrictEqual([
    await fs.readFile(path.join(projectRoot, 'lib', 'a.ts'), 'utf-8'),
    await fs.readFile(path.join(projectRoot, 'index.ts'), 'utf-8')
  ])
})

test('AddSources transformer: ignore errors when source map is in an unexpected format', async () => {
  const projectRoot = path.join(__dirname, 'fixtures', 'typescript')
  const absolutePath = path.join(projectRoot, 'dist', 'out.js.map')
  await AddSources(absolutePath, 1, projectRoot, noopLogger)
})

test('AddSources transformer: webpack example', async () => {
  const projectRoot = path.join(__dirname, 'fixtures', 'webpack')
  const absolutePath = path.join(projectRoot, 'dist', 'main.js.map')
  const sourceMapJson = JSON.parse(await fs.readFile(absolutePath, 'utf-8'))
  await AddSources(absolutePath, sourceMapJson, projectRoot, noopLogger)
  expect(sourceMapJson.sourcesContent).toStrictEqual([
    await fs.readFile(path.join(projectRoot, 'lib', 'a.js'), 'utf-8'),
    null,
    await fs.readFile(path.join(projectRoot, 'index.js'), 'utf-8')
  ])
})

test('AddSources transformer: webpack example (synthetic sections)', async () => {
  const projectRoot = path.join(__dirname, 'fixtures', 'webpack')
  const absolutePath = path.join(projectRoot, 'dist', 'main.js.map')
  const sourceMapJson = { sections: [ { map: JSON.parse(await fs.readFile(absolutePath, 'utf-8')) } ] }
  await AddSources(absolutePath, sourceMapJson, projectRoot, noopLogger)
  expect(sourceMapJson.sections[0].map.sourcesContent).toStrictEqual([
    await fs.readFile(path.join(projectRoot, 'lib', 'a.js'), 'utf-8'),
    null,
    await fs.readFile(path.join(projectRoot, 'index.js'), 'utf-8')
  ])
})

test('AddSources transformer: webpack example with namespace', async () => {
  const projectRoot = path.join(__dirname, 'fixtures', 'webpack-2')
  const absolutePath = path.join(projectRoot, 'dist', 'main.js.map')
  const sourceMapJson = { sections: [ { map: JSON.parse(await fs.readFile(absolutePath, 'utf-8')) } ] }
  await AddSources(absolutePath, sourceMapJson, projectRoot, noopLogger)
  expect(sourceMapJson.sections[0].map.sourcesContent).toStrictEqual([
    await fs.readFile(path.join(projectRoot, 'lib', 'a.js'), 'utf-8'),
    null,
    await fs.readFile(path.join(projectRoot, 'index.js'), 'utf-8')
  ])
})

test('AddSources transformer: webpack example (synthetic missing source)', async () => {
  const projectRoot = path.join(__dirname, 'fixtures', 'webpack')
  const absolutePath = path.join(projectRoot, 'dist', 'main.js.map')
  const sourceMapJson = JSON.parse(await fs.readFile(absolutePath, 'utf-8'))
  sourceMapJson.sources[2] = 'index--nothanks.js'
  await AddSources(absolutePath, sourceMapJson, projectRoot, noopLogger)
  expect(sourceMapJson.sourcesContent).toStrictEqual([
    await fs.readFile(path.join(projectRoot, 'lib', 'a.js'), 'utf-8'),
    null,
    null
  ])
})