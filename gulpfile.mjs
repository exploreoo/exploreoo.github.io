import gulp from "gulp";
import { execa } from "execa";
import prettier from "prettier";
import minimist from 'minimist';
import fs from 'node:fs';
// 解析命令行参数
const argv = minimist(process.argv.slice(2));

// 示例命令: gulp push --info=你的提交信息
gulp.task("push", async function (cb) {
  const { stdout: stdout1 } = await execa("git", ["add", "."], {
    stdio: "inherit",
  });
  console.log(stdout1 || '');
  const commitMessage = argv.info || "update"; // 从命令行获取提交信息，默认为"update"
  const { stdout: stdout2 } = await execa("git", ["commit", "-m", commitMessage], {
    stdio: "inherit",
  });
  console.log(stdout2 || '');
  const { stdout: stdout3 } = await execa("git", ["pull"], {
    stdio: "inherit",
  });
  console.log(stdout3 || '');
  const { stdout: stdout4 } = await execa("git", ["push"], {
    stdio: "inherit",
  });
  console.log(stdout4 || '');
  cb();
});

gulp.task("publish", async function (cb) {
  await gulp.series("lint")();
  const { stdout: stdout1 } = await execa("npm", ["run", "clean"], {
    stdio: "inherit",
  });
  console.log(stdout1);
  const { stdout: stdout2 } = await execa("npm", ["run", "generate"], {
    stdio: "inherit",
  });
  console.log(stdout2);
  const { stdout: stdout3 } = await execa("npm", ["run", "deploy"], {
    stdio: "inherit",
  });
  console.log(stdout3);
  cb();
});

gulp.task("run", async function (cb) {
  const { stdout: stdout1 } = await execa("npm", ["run", "clean"], {
    stdio: "inherit",
  });
  console.log(stdout1);
  const { stdout: stdout2 } = await execa("npm", ["run", "generate"], {
    stdio: "inherit",
  });
  console.log(stdout2);
  const { stdout: stdout3 } = await execa("npm", ["run", "server"], {
    stdio: "inherit",
  });
  console.log(stdout3);
  cb();
});

// 格式化文件
gulp.task("lint", async function (cb) {
  const directoryPath = "E:/demo/weblog/source"; // Use forward slashes for file paths

  async function formatFilesInDirectory(dirPath) {
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = `${dirPath}/${entry.name}`; // Use forward slashes for file paths
        if (entry.isDirectory()) {
          await formatFilesInDirectory(fullPath); // Recursively format files in subdirectories
        } else if (entry.isFile()) {
          const contents = await fs.promises.readFile(fullPath, { encoding: 'utf8' });
          const formattedContent = await prettier.format(contents, {
            parser: 'markdown'
          });
          await fs.promises.writeFile(fullPath, formattedContent, { encoding: 'utf8' });
          console.log(`Formatted ${fullPath}`);
        }
      }
    } catch (error) {
      console.error(`Error formatting files in ${dirPath}:`, error);
    }
  }

  await formatFilesInDirectory(directoryPath);
  cb();
});

let watcher;
function onChange() {
  watcher = gulp.watch("**/*.md", { ignoreInitial: true });
  watcher.on("change", async function (path) {
    console.log(`${path} was changed`);
    try {
      const contents = await fs.promises.readFile(path, { encoding: 'utf8' });
      const formattedContent = await prettier.format(contents, {
        parser: 'markdown'
      });
      if (contents !== formattedContent) {
        await fs.promises.writeFile(path, formattedContent, { encoding: 'utf8' });
        console.log(`Formatted and saved ${path}`);
      } else {
        console.log(`No changes needed for ${path}`);
      }
    } catch (error) {
      console.error(`Error processing ${path}:`, error);
    }
  });
}

gulp.task("default", gulp.series("lint", function () {
  onChange();
}));
