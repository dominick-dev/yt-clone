import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { dir } from "console";

const storage = new Storage();

const rawVideoBucketName = "devd-yt-raw-videos";
const processedVideoBucketName = "devd-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed videos
 */
export function setupDirectories() {
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
}

/**
 *
 * @param rawVideoName name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName name of the file to to convert to {@link localProcessedVideoPath}
 * @returns a promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    //   create ffmpeg command
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-2:360") // scale to 360p
      .on("end", function () {
        console.log("Video processing finished successfully.");
        resolve();
      })
      .on("error", function (err) {
        console.log(`An error occurred: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName name of the file to upload from the {@link rawVideoBucketName} folder
 * into the {@link localRawVideoPath}
 * @returns a promise that resolves when the file has been downloaded
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
  );
}

/**
 * @param fileName name of the file to upload from the {@link localProcessedVideoPath} folder
 * into the {@link processedVideoBucketName}
 * @returns a promise that resolves when the file has been downloaded
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });
  console.log(
    `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
  );

  await bucket.file(fileName).makePublic();
}

/**
 * @param fileName name of file to delete from {@link localRawVideoPath} folder
 * @returns promise that resolves when the file has been deleted
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName name of file to delete from {@link localProcessedVideoPath} folder
 * @returns promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath path of file to delete
 * @returns a promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Failed to delete file at ${filePath}`, err);
          reject(err);
        } else {
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not found at ${filePath}, skipping delete`);
      resolve();
    }
  });
}

/**
 * Ensures a directory exists, creates one if necessary
 * @param dirPath directory path to check
 */
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // enables creating nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}
