import express from "express";
import ffmpeg from "fluent-ffmpeg";

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

  //   create ffmpeg command
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-2:360") // scale to 360p
    .on("end", function () {
      console.log("Video processing finished successfully.");
      res.status(200).send("Video processing finished successfully.");
    })
    .on("error", function (err) {
      console.log(`An error occurred: ${err.message}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
