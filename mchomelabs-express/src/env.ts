import * as dotenv from 'dotenv'

dotenv.config()

export const SERVER_JAR_PATH = process.env.SERVER_JAR_PATH ?? 'SERVER_PATH env var not found!'
export const JAR_FILE_NAME = process.env.JAR_FILE_NAME ?? 'JAR_FILE_NAME env var not found!'
export const LATEST_LOGS_PATH = process.env.LATEST_LOGS_PATH ?? 'No LATEST_LOGS_PATH env var found!'