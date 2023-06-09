import { IUserCourse } from "../interfaces/IUserCourse.js";
import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const Schema = mongoose.Schema;
const UserCourseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "users",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "courses",
      autopopulate: true,
    },
    learningPath: [
      {
        name: {
          type: String,
          required: false,
          trim: true,
        },
        units: [
          {
            name: {
              type: String,
              required: false,
              trim: true,
            },
            isConceptLink: {
              type: Boolean,
              required: false,
              trim: true,
            },
            type: {
              type: String,
              required: false,
              trim: true,
            },
            note: {
              type: String,
              required: false,
              trim: true,
            },
            file: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            isCompleted: {
              type: Boolean,
              required: false,
              trim: true,
            },
            duration: {
              type: String,
              required: false,
              trim: true,
            },
            video: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            preTest: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "concepts",
              autopopulate: true,
            },
            visualNote: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            mindmap: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            textRichFile: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            realExampleVideo: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            realExampleDoc: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            additionalVideo: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            additionalMaterials: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            audio: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningResources",
              autopopulate: true,
            },
            loId: {
              type: Schema.Types.ObjectId,
              required: false,
              ref: "LearningObjects",
              autopopulate: true,
            },
            quiz: {
              questions: [
                {
                  type: Schema.Types.ObjectId,
                  required: false,
                  ref: "quiz",
                  autopopulate: true,
                },
              ],
              score: {
                type: String,
                required: false,
                trim: true,
              },
              analysis: {
                type: Object,
                required: false,
                trim: true,
              },
            },
          },
        ],
      },
    ],
    progress: {
      type: Number,
      required: true,
      trim: true,
      default: 0,
    },
    currentUnit: {
      sectionNum: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
      },
      unitNum: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
      },
    },
  },
  { timestamps: true }
);
UserCourseSchema.plugin(mongooseAutoPopulate);
export default mongoose.model<IUserCourse & mongoose.Document>("userCourses", UserCourseSchema);
