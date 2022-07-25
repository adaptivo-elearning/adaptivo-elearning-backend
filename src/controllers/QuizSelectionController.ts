import autoBind from 'auto-bind';
import { Logger } from '../loaders/logger.js';
import { IQuizSelectionService } from '../services/interfaces/IQuizSelectionService.js';
import { QuizSelectionService } from '../services/QuizSelectionService.js';


export default class QuizSelectionController {
    private logger: Logger;
    private quizSelectionService: IQuizSelectionService;

    constructor() {
      this.logger = Logger.getInstance();
      this.quizSelectionService = QuizSelectionService.getInstance();
      autoBind(this)
    }

    public async selectQuiz(req: any, res: any): Promise<void> {
      this.logger.info('QuizSelectionController - selectQuiz()');

      const target = req.params.target;
      const prevConcept = req.params.prevConcept;
      const prevLearningObject = req.params.prevLearningObject;
      const answerCorrect = req.params.answerCorrect;

      await this.quizSelectionService.selectQuiz(target, prevConcept, prevLearningObject, answerCorrect)
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          this.logger.error(error.message);
          res.status(500).send({ err: error.message });
        });
    }
}