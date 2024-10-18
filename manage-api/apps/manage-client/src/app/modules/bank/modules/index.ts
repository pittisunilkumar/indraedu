import { BannersModule } from './banners/banners.module';
import { QuestionsTagsModule } from './questions-tags/questions-tags.module';
import { QuestionsModule } from './questions/questions.module';
import { SyllabusModule } from './syllabus/syllabus.module';
import { VideoCipherModule } from './video-cipher/video-cipher.module';

// let currentUser;
// currentUser = JSON.parse(localStorage.getItem('rolePermissions'));
// console.log('B-currentUser',currentUser);
// export let moduleArray = []
// currentUser?.rolePermissions.map(res => {
//   if (res.module[0].title === 'BANNERS'){
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(BannersModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'QUESTION_TAGS'){
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(QuestionsTagsModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'QUESTIONS'){
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(QuestionsModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'SYLLABUS'){
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(SyllabusModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'VIDEO_CYPHER'){
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(VideoCipherModule)
//       }
//     })
//   }
// })
// moduleArray.sort()
// export const modules = moduleArray.length > 0 ? moduleArray : []
// console.log('modules', modules);

export const modules = [
  BannersModule,
  QuestionsModule,
  SyllabusModule,
  VideoCipherModule,
  QuestionsTagsModule
];

export * from './banners/banners.module';
export * from './questions/questions.module';
export * from './syllabus/syllabus.module';
export * from './video-cipher/video-cipher.module';
export * from './questions-tags/questions-tags.module';