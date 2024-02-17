const gulp = require('gulp');
const replace = require('gulp-replace');
const minimist = require('minimist');
const rename = require('gulp-rename');
const fs = require('fs');
const es = require('event-stream');
const path = require('path');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

function generate() {
  const knownOptions = {
    string: ['model'],
    default: { model: 'DefaultModelName' }
  };
  const options = minimist(process.argv.slice(2), knownOptions);

  const typesFile = path.join(process.cwd(), 'types/projectModels.d.ts');

  const updateTypes = fs.createReadStream(typesFile)
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
      if(line.trim().startsWith('*')) {
        return line;
      } else if(line.trim().startsWith('/**')) {
        return line;
      } else if(line.includes('export type ProjectModels')) {
        return `import ${options.model} from "../api/models/${options.model}";\n\n` + line;
      }
      // add new line into ProjectModels
      if(line.includes('}')) {
        return `  ${options.model}: ${options.model};\n` + line;
      }
      return line;
    }))
    .pipe(es.join('\n'))
    .pipe(source('projectModels.d.ts'))
    .pipe(buffer());

  return es.merge(
    gulp.src(path.join(__dirname, './templates/Model.template'))
      .pipe(replace('Example', options.model))
      .pipe(rename(`${options.model}.ts`))
      .pipe(gulp.dest(`./api/models/`)),
    updateTypes.pipe(gulp.dest(path.join(process.cwd(), `./types/`)))
  );
}

module.exports = generate;
