module.exports = class GetCliParams {
  constructor({ args, argv, logger }) {
    this.args = args;
    this.argv = argv;
    this.logger = logger;
  }

  setupArgs = () =>
    this.args
      .option('markdown', 'The root directory where your documentation lives')
      .option('styleguidist', 'root directory where the generated styleguidist index.html lives');

  getArgs = () => {
    const { markdown, styleguidist } = this.args.parse(this.argv);

    return {
      markdownFlag: markdown,
      styleguidistFlag: styleguidist,
    };
  };

  validateArgs = ({ markdownFlag, styleguidistFlag }) => {
    !markdownFlag && this.logger.error('--markdown flag must be supplied');
    !styleguidistFlag && this.logger.error('--styleguidist flag must be supplied');
    if (!markdownFlag || !styleguidistFlag) throw new Error();
    this.logger.ready('cli parameters are present');
  };

  init = () => {
    this.setupArgs();
    const flags = this.getArgs();
    this.validateArgs(flags);
    return flags;
  };
};
