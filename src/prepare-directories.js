module.exports = class PrepareDirectories {
  constructor({ path, curentDir, emptyDirAsync, logger }) {
    this.path = path;
    this.curentDir = curentDir;
    this.emptyDirAsync = emptyDirAsync;
    this.logger = logger;
  }

  getDirs = ({ markdownFlag, styleguidistFlag }) => ({
    markdownDir: this.path.resolve(this.curentDir, markdownFlag),
    styleguidistDir: this.path.resolve(this.curentDir, styleguidistFlag),
    translationsDir: this.path.resolve(this.curentDir, styleguidistFlag, 'translations'),
  });

  valadateDirs = ({ markdownDir, styleguidistDir }) => {
    markdownDir && this.logger.log(`markdown directory = ${markdownDir}`);
    styleguidistDir && this.logger.log(`styleguidist directory = ${styleguidistDir}`);
    if (!markdownDir || !styleguidistDir) throw new Error();
  };

  cleanTranslationsDir = ({ translationsDir }) => this.emptyDirAsync(translationsDir);

  init = async flags => {
    const dirs = this.getDirs(flags);
    this.valadateDirs(dirs);
    await this.cleanTranslationsDir(dirs);
    return dirs;
  };
};
