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
    markdownDir && this.logger.info(`markdown directory = ${markdownDir}`);
    styleguidistDir && this.logger.info(`styleguidist directory = ${styleguidistDir}`);
    if (!markdownDir || !styleguidistDir) throw new Error();
  };

  cleanTranslationsDir = ({ translationsDir }) => this.emptyDirAsync(translationsDir);

  init = async cliFlags => {
    const dirs = this.getDirs(cliFlags);
    this.valadateDirs(dirs);
    await this.cleanTranslationsDir(dirs);
    return dirs;
  };
};
