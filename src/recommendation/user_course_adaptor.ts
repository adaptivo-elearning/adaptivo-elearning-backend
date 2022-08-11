import { ConceptService } from '../services/ConceptService.js';
import { CourseService } from '../services/CourseService.js';
import { LearningStyleService } from '../services/LearningStyleService.js';

export const adaptUserCourse = async (userId: string, courseId: string) => {
  const course: any = await CourseService.getInstance().getCourseById(courseId);
  const learningStyle: any = await LearningStyleService.getInstance().getLearningStyleByUserId(userId);

  const originalCurriculum: any = course.curriculum;
  const adaptedCurriculum = [];

  await originalCurriculum.forEach((lesson: any, lessonIndex: number, lessonArray: any[]) => {
    // lessonArray[lessonIndex] = { name: 'replaced...', _id: 'bogus_id' }
    // console.log(index);
    let adaptedLesson = {
      _id: lesson._id,
      name: lesson.name,
      units: [],
    }

    let units = lesson.units;

    units.forEach((unit: any, index: number, unitArray: any[]) => {
      // Check if linked to a concept
      if (unit.isConceptLink) {
        let adaptedUnit = {
          _id: unit._id,
          name: unit.name,
          isConceptLink: true,
          quiz: unit.quiz,
          isCompleted: false,
          duration: "0",
          currentUnit: {
            sectionNum: 0,
            unitNum: 0,
            duration: 0,
          }
        }
        
        let learningObject = unit.loId;
        
        const inputStyle = learningStyle.detectedLearningStyle.input;
        const processingStyle = learningStyle.detectedLearningStyle.processing;
        const understandingStyle = learningStyle.detectedLearningStyle.understanding;
        const perceptionStyle = learningStyle.detectedLearningStyle.perception;

        // Consider perception dimension
        switch (perceptionStyle) {
          case 'visual':
            // Add visual note
            let visualNote = populateNewUnit(adaptedUnit, 'visualNote', learningObject.visual);
            adaptedLesson.units.push(visualNote);

            // Add mindmap
            let mindmap = populateNewUnit(adaptedUnit, 'mindmap', learningObject.visual);
            adaptedLesson.units.push(mindmap);
          
            break;
          
          case 'verbal':
          case 'balanced':
            // Add text-rich file
            let textRichFile = populateNewUnit(adaptedUnit, 'textRichFile', learningObject.verbal);
            adaptedLesson.units.push(textRichFile);
            break;

          default:
            // Add video regardless of style
            let video = populateNewUnit(adaptedUnit, 'video', learningObject.visual);
            adaptedLesson.units.push(video);
            break;
        }

        // Consider input dimension
        switch (inputStyle) {
          case 'intuitive':
            switch (perceptionStyle) {
              case 'visual':
                // Add additional video
                let additionalVideo = populateNewUnit(adaptedUnit, 'additionalVideo', learningObject.intuitive);
                adaptedLesson.units.push(additionalVideo);
                break;
              
              case 'verbal':
                // Add additional materials
                let additionalMaterials = populateNewUnit(adaptedUnit, 'additionalMaterials', learningObject.intuitive);
                adaptedLesson.units.push(additionalMaterials);
                break;

              case 'balanced':
                // Add additional video
                let additionalVideoBalanced = populateNewUnit(adaptedUnit, 'additionalVideo', learningObject.intuitive);
                adaptedLesson.units.push(additionalVideoBalanced);

                // Add additional materials
                let additionalMaterialsBalanced = populateNewUnit(adaptedUnit, 'additionalMaterials', learningObject.intuitive);
                adaptedLesson.units.push(additionalMaterialsBalanced);

                break;
            }
            
            break;
          
          case 'sensing':
            switch (perceptionStyle) {
              case 'visual':
                // Add real example video
                let realExampleVideo = populateNewUnit(adaptedUnit, 'realExampleVideo', learningObject.intuitive);
                adaptedLesson.units.push(realExampleVideo);
                break;
              
              case 'verbal':
                // Add real example doc
                let realExampleDoc = populateNewUnit(adaptedUnit, 'realExampleDoc', learningObject.intuitive);
                adaptedLesson.units.push(realExampleDoc);
                break;
            }

            break;
        }

        // Consider processing dimension
        switch (processingStyle) {
          case 'active':
            // Add quiz
            let quiz = populateNewUnit(adaptedUnit, 'quiz', learningObject.active);
            adaptedLesson.units.push(quiz);
            break;

          case 'reflective':
            // Add mindmap if perception style is not visual (to avoid duplicates)
            if (perceptionStyle !== 'visual') {
              let mindmap = populateNewUnit(adaptedUnit, 'mindmap', learningObject.visual);
              adaptedLesson.units.push(mindmap);
              break;
            }
        }
        
      } else {
        adaptedLesson.units.push(unit);
      }
    });

    adaptedCurriculum.push(adaptedLesson); 
  });

  return adaptedCurriculum;
}

const populateNewUnit = (unitBase: any, unitType: string, loForStyle: any): any => {
  let unit = JSON.parse(JSON.stringify(unitBase));
  unit['type'] = unitType;
  unit[unitType] = loForStyle[unitType];

  return unit;
}