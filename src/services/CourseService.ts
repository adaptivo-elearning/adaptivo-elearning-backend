import { ICourse } from "../interfaces/ICourse.js";
import { Logger } from "../loaders/logger.js";
import { ICourseService } from "./interfaces/ICourseService.js";
import { CourseDao } from "../dao/CourseDao.js";
import { getPreSignedUrl } from "../libs/getPreSignedUrl.js";
import { ILearningResource } from "../interfaces/ILearningResource.js";
import { LearningResourceService } from "./LearningResourceService.js";
import { IQuiz } from "../interfaces/IQuiz.js";
import { QuizService } from "./QuizService.js";
import { DrmService } from "./DrmService.js";

export class CourseService implements ICourseService {
  private logger = Logger.getInstance();
  public static instance: CourseService = null;
  private CourseDao = CourseDao.getInstance();
  public static getInstance(): CourseService {
    if (this.instance === null) {
      this.instance = new CourseService();
    }
    return this.instance;
  }

  public async createCourse(request: any): Promise<ICourse> {
    this.logger.info("CourseService - createCourse()");

    let curriculum = [];

    for (let section of request.curriculum.sections) {
      let tempSection: any = {};
      tempSection.name = section.name;
      tempSection.units = [];
      // let unit: any;
      for (let unit of section.units) {
        let tempUnit: any = {};

        tempUnit.name = unit.name;
        tempUnit.isConceptLink = unit.isConceptLink;
        if (unit.isConceptLink) {
          tempUnit.loId = unit.loId;
          tempUnit.conceptId = unit.conceptId;
        } else {
          tempUnit.type = unit.type;

          if (unit.type == "video") {
            const resource: ILearningResource = {
              name: unit[unit.type]["name"],
              type: unit.type,
              style: "visual",
              subStyle: "video",
              size: unit[unit.type].size,
              duration: unit[unit.type].duration,
              url: `https://spark-courses.s3.ap-south-1.amazonaws.com/62272fbfc8ea4d8b75b76aa2/resources/videos/${unit[unit.type]["name"]}`,
            };
            const response = await LearningResourceService.getInstance().createLearningResource(resource);
            tempUnit[unit.type] = response._id;
          }
          if (unit.type == "file") {
            const resource: ILearningResource = {
              name: unit[unit.type]["name"],
              type: unit.type,
              style: "verbal",
              subStyle: "textRichFile",
              size: unit[unit.type].size,
              duration: "00:05:00",
              url: `https://spark-courses.s3.ap-south-1.amazonaws.com/62272fbfc8ea4d8b75b76aa2/resources/files/${unit[unit.type]["name"]}`,
            };
            const response = await LearningResourceService.getInstance().createLearningResource(resource);
            tempUnit[unit.type] = response._id;
          }
          if (unit.type == "quiz") {
            let quizIds = [];

            for (let quiz of unit.quiz) {
              const question: IQuiz = {
                question: quiz.title,
                explanation: quiz.explanation,
                answers: quiz.answers,
                correctAnswer: quiz.correctAnswer,
              };
              const quizResponse: IQuiz = await QuizService.getInstance().createQuiz(question);
              quizIds.push(quizResponse._id);
            }
            tempUnit.quiz = quizIds;
          }
          if (unit.type == "note") {
            tempUnit.note = unit.note;
          }
          if (unit.type == "preTest") {
            tempUnit.preTest = unit.preTest;
          }
        }
        tempSection.units.push(tempUnit);
      }
      curriculum.push(tempSection);
    }

    const course: ICourse = {
      title: request.title,
      subtitle: request.subtitle,
      category: request.category,
      subCategory: request.subCategory,
      language: request.language,
      level: request.level,
      thumbnail: {
        ...request.thumbnail,
        url: `https://spark-courses.s3.ap-south-1.amazonaws.com/62272fbfc8ea4d8b75b76aa2/courses/thumbnail/${request.thumbnail.name}`,
      },
      trailer: {
        ...request.trailer,
        url: `https://spark-courses.s3.ap-south-1.amazonaws.com/62272fbfc8ea4d8b75b76aa2/courses/trailer/${request.trailer.name}`,
      },
      description: request.description,
      outcomes: Object.values(request.outcomes),
      requirements: Object.values(request.requirements),
      welcome: request.welcome,
      congratulations: request.congratulations,
      price: request.price.value,
      tier: request.price.type,
      currency: request.price.currency,
      instructors: request.instructors,
      curriculum: curriculum,
    };

    return this.CourseDao.save(course)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }
  public async getAllCourse(): Promise<ICourse[]> {
    this.logger.info("CourseService - getAllCourse()");
    return this.CourseDao.getAll()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }
  public async getCourseById(id: string): Promise<ICourse | any> {
    this.logger.info("CourseService - getCourseById()");
    return this.CourseDao.getById(id)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }

  public async updateCourse(id: string, Course: ICourse): Promise<ICourse | Object> {
    this.logger.info("CourseService - updateCourse()");
    return this.CourseDao.update(id, Course)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }
  public async deleteCourse(id: string): Promise<ICourse | Object> {
    this.logger.info("CourseService - deleteCourse()");
    return this.CourseDao.delete(id)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }
  public async getThumbnailSignedUrl(fileName: string): Promise<Object> {
    this.logger.info("CourseService - getThumbnailSignedUrl()");

    const bucketName = `spark-courses`;
    const key = `62272fbfc8ea4d8b75b76aa2/courses/thumbnail/${fileName}`;

    return getPreSignedUrl(bucketName, key)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }
  public async getTrailerSignedUrl(fileName: string): Promise<Object> {
    this.logger.info("CourseService - getTrailerSignedUrl()");

    const bucketName = `spark-courses`;
    const key = `62272fbfc8ea4d8b75b76aa2/courses/trailer/${fileName}`;

    return getPreSignedUrl(bucketName, key)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }

  public async encodeCourse(courseId: string) {
    this.logger.info("CourseService - encodeCourse()");

    // const course = await this.getCourseById(courseId);

    const input = "https://spark-courses.s3.ap-south-1.amazonaws.com/62272fbfc8ea4d8b75b76aa2/concepts/videos/Newton's+First+Law+of+Motion.mp4";
    const output = "https://spark-courses.s3.ap-south-1.amazonaws.com/62ea7ec10adc970a2ee22b00/encoded/concepts/62e94af64b2cdca5b1245d94/videos";

    return DrmService.getInstance()
      .encodeFile(input, output)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });

    // course.curriculum.map((section) => {
    //   section.units.map((unit) => {
    //     if (unit.isConceptLink) {
    //       unit.conceptId.learningObjects.map((lo) => {
    //         let outputlocation = `https://spark-courses.s3.ap-south-1.amazonaws.com/${courseId}/encoded/concepts/${unit.conceptId._id}/videos/`;
    //         DrmService.getInstance().encodeFile(lo.visual.video.url, outputlocation);
    //         lo.visual.video.url;
    //         lo.sensing.realExampleVideo.url;
    //         lo.intuitive.additionalVideo.url;
    //       });
    //     }
    //   });
    // });
  }
}
