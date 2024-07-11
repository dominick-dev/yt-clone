import express from "express";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
  // get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  //   check if input file path is defined
  if (!inputFilePath || !outputFilePath) {
    res.status(400).send("Bad Request: Missing file path.");
  }

  const startTime = Date.now();

  //   create ffmpeg command
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-2:360") // scale to 360p
    .on("start", (commandLine) => {
      console.log(`Spawned ffmpeg with command: ${commandLine}`);
    })
    .on("progress", (progress) => {
      console.log(
        `Processing: ${progress.percent ? progress.percent : 0}% done`
      );
    })
    .on("end", function () {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log(`Video processing finished in ${duration} seconds`);

      //   check if the output file was created and has size > 0
      fs.stat(outputFilePath, (err, stats) => {
        if (err) {
          console.error(`Error checking output file: ${err.message}`);
          return res
            .status(500)
            .send(`Error checking output file ${err.message}`);
        }
        if (stats.size == 0) {
          console.error("Processed video is 0KB");
          return res.status(500).send("Processed video is 0KB");
        }
        res.status(200).send("Video processing finished successfully.");
      });
    })
    .on("error", function (err, stdout, stderr) {
      console.log(`An error occurred: ${err.message}`);
      console.error(`ffmpeg stderr: ${stderr}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// // first version
// import express from "express";
// import ffmpeg from "fluent-ffmpeg";

// const app = express();
// app.use(express.json());

// app.post("/process-video", (req, res) => {
//   // get path of the input video file from the request body
//   const inputFilePath = req.body.inputFilePath;
//   const outputFilePath = req.body.outputFilePath;

//   //   check if input file path is defined
//   if (!inputFilePath || !outputFilePath) {
//     res.status(400).send("Bad Request: Missing file path.");
//   }

//   const startTime = Date.now();

//   //   create ffmpeg command
//   ffmpeg(inputFilePath)
//     .outputOptions("-vf", "scale=-2:360") // scale to 360p
//     .on("end", function () {
//       console.log("Video processing finished successfully.");
//       res.status(200).send("Video processing finished successfully.");
//     })
//     .on("error", function (err) {
//       console.log(`An error occurred: ${err.message}`);
//       res.status(500).send(`Internal Server Error: ${err.message}`);
//     })
//     .save(outputFilePath);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
