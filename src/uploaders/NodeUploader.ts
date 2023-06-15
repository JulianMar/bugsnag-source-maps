import path from 'path'
import http from 'http'
import glob from 'glob'

import { Logger, noopLogger } from '../Logger'
import File from '../File'
import request, { PayloadType } from '../Request'
import formatErrorLog from './lib/FormatErrorLog'
import applyTransformations from './lib/ApplyTransformations'
import readBundleContent from './lib/ReadBundleContent'
import readSourceMap from './lib/ReadSourceMap'
import parseSourceMap from './lib/ParseSourceMap'
import _detectAppVersion from './lib/DetectAppVersion'
import {
  validateRequiredStrings,
  validateOptionalStrings,
  validateBooleans,
  validateObjects,
  validateNoUnknownArgs
} from './lib/InputValidators'

import { DEFAULT_UPLOAD_ORIGIN, buildEndpointUrl } from './lib/EndpointUrl'
const UPLOAD_PATH = '/sourcemap'

interface UploadSingleOpts {
  apiKey: string
  sourceMap: string
  bundle: string
  appVersion?: string
  codeBundleId?: string
  overwrite?: boolean
  projectRoot?: string
  endpoint?: string
  detectAppVersion?: boolean
  requestOpts?: http.RequestOptions
  logger?: Logger
  idleTimeout?: number
}

function validateOneOpts (opts: Record<string, unknown>, unknownArgs: Record<string, unknown>) {
  validateRequiredStrings(opts, [ 'apiKey', 'sourceMap', 'projectRoot', 'endpoint' ])
  validateOptionalStrings(opts, [ 'bundle', 'appVersion', 'codeBundleId' ])
  validateBooleans(opts, [ 'overwrite', 'detectAppVersion' ])
  validateObjects(opts, [ 'requestOpts', 'logger' ])
  validateNoUnknownArgs(unknownArgs)
}

export async function uploadOne ({
  apiKey,
  bundle,
  sourceMap,
  appVersion,
  codeBundleId,
  idleTimeout,
  overwrite = false,
  projectRoot = process.cwd(),
  endpoint = DEFAULT_UPLOAD_ORIGIN,
  detectAppVersion = false,
  requestOpts = {},
  logger = noopLogger,
  ...unknownArgs
}: UploadSingleOpts): Promise<void> {
  validateOneOpts({
    apiKey,
    bundle,
    sourceMap,
    appVersion,
    codeBundleId,
    overwrite,
    projectRoot,
    endpoint,
    detectAppVersion,
    requestOpts,
    logger
  }, unknownArgs as Record<string, unknown>)

  logger.info(`Preparing upload of node source map for "${bundle}"`)

  let url
  try {
    url = buildEndpointUrl(endpoint, UPLOAD_PATH)
  } catch (e) {
    logger.error(e)
    throw e
  }

  const [ sourceMapContent, fullSourceMapPath ] = await readSourceMap(sourceMap, projectRoot, logger)
  const [ bundleContent, fullBundlePath ] = await readBundleContent(bundle, projectRoot, sourceMap, logger)

  const sourceMapJson = parseSourceMap(sourceMapContent, sourceMap, logger)
  const transformedSourceMap = await applyTransformations(fullSourceMapPath, sourceMapJson, projectRoot, logger)

  if (detectAppVersion) {
    try {
      appVersion = await _detectAppVersion(projectRoot, logger)
    } catch (e) {
      logger.error(e.message)

      throw e
    }
  }

  logger.debug(`Initiating upload to "${url}"`)
  const start = new Date().getTime()
  try {
    await request(url, {
      type: PayloadType.Node,
      apiKey,
      appVersion,
      codeBundleId,
      minifiedUrl: bundle.replace(/\\/g, '/'),
      minifiedFile: new File(fullBundlePath, bundleContent),
      sourceMap: new File(fullSourceMapPath, JSON.stringify(transformedSourceMap)),
      overwrite: overwrite
    }, requestOpts, { idleTimeout })
    logger.success(`Success, uploaded ${sourceMap} and ${bundle} to ${url} in ${(new Date()).getTime() - start}ms`)
  } catch (e) {
    if (e.cause) {
      logger.error(formatErrorLog(e), e, e.cause)
    } else {
      logger.error(formatErrorLog(e), e)
    }
    throw e
  }
}

interface UploadMultipleOpts {
  apiKey: string
  directory: string
  appVersion?: string
  codeBundleId?: string
  overwrite?: boolean
  projectRoot?: string
  endpoint?: string
  detectAppVersion?: boolean
  requestOpts?: http.RequestOptions
  logger?: Logger
  idleTimeout?: number
}

function validateMultipleOpts (opts: Record<string, unknown>, unknownArgs: Record<string, unknown>) {
  validateRequiredStrings(opts, [ 'apiKey', 'directory', 'projectRoot', 'endpoint' ])
  validateOptionalStrings(opts, [ 'appVersion', 'codeBundleId' ])
  validateBooleans(opts, [ 'overwrite', 'detectAppVersion' ])
  validateObjects(opts, [ 'requestOpts', 'logger' ])
  validateNoUnknownArgs(unknownArgs)
}

export async function uploadMultiple ({
  apiKey,
  directory,
  appVersion,
  codeBundleId,
  idleTimeout,
  overwrite = false,
  projectRoot = process.cwd(),
  endpoint = DEFAULT_UPLOAD_ORIGIN,
  detectAppVersion = false,
  requestOpts = {},
  logger = noopLogger,
  ...unknownArgs
}: UploadMultipleOpts): Promise<void> {
  validateMultipleOpts({
    apiKey,
    directory,
    appVersion,
    codeBundleId,
    overwrite,
    projectRoot,
    endpoint,
    detectAppVersion,
    requestOpts,
    logger
  }, unknownArgs as Record<string, unknown>)

  logger.info(`Preparing upload of node source maps for "${directory}"`)

  let url
  try {
    url = buildEndpointUrl(endpoint, UPLOAD_PATH)
  } catch (e) {
    logger.error(e)
    throw e
  }

  logger.debug(`Searching for source maps "${directory}"`)
  const absoluteSearchPath = path.resolve(projectRoot, directory)
  const sourceMaps: string[] = await new Promise((resolve, reject) => {
    glob('**/*.map', { ignore: '**/node_modules/**', cwd: absoluteSearchPath }, (err, files) => {
      if (err) return reject(err)
      resolve(files)
    })
  })

  if (sourceMaps.length === 0) {
    logger.warn('No source maps found.')
    return
  }

  const promises = sourceMaps.map(async (sourceMap) => {
    uploadOne({apiKey, bundle: sourceMap.replace(/\.map$/, ''), sourceMap, appVersion, codeBundleId, overwrite, projectRoot, endpoint, detectAppVersion, requestOpts, logger, idleTimeout})
  })

  await Promise.all(promises)

  return;
}
