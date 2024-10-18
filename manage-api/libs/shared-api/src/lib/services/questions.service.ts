import { QuestionInterface, QbankQuestionInterface, TestSeriesQuestionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from '../dto';
import { Question, QBankSubject, TSCategories, Syllabus, User, Pearls } from '../schema';
//import { Question,QuestionDocument } from '../schema/questions.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
    @InjectModel('Syllabus') private SyllabusModel: Model<Syllabus>,
    @InjectModel('User') private UserModel: Model<User>,
    @InjectModel('Pearls') private pearlsModel: Model<Pearls>
  ) { }

  // find(options) {
  //   return this.questionModel.find(options);
  // }
  // count(options) {
  //   return this.questionModel.countDocuments(options)
  // }
  async createMultiQuestions(request: any) {
    //  console.log('request',request);
    let array = []
    let sId = request[0].syllabus[0]
    var data = await this.questionModel.find({ syllabus: sId + '' }).exec();
    let syllabusData = await this.SyllabusModel.findById({ _id: sId });
    let code = syllabusData.shortcut;
    let uniqueCode: string;
    request.map((res, i) => {
      let num = data.length + i + 1
      if (num > 0 && num <= 9)
        uniqueCode = code + "0000" + num;
      else if (num > 9 && num <= 99)
        uniqueCode = code + "000" + num;
      else if (num > 99 && num <= 999)
        uniqueCode = code + "00" + num;
      else if (num > 999 && num <= 9999)
        uniqueCode = code + "0" + num;
      else
        uniqueCode = code + num;
      res.questionId = uniqueCode
      array.push(res)
    })
    return this.questionModel.insertMany(array)
  }

  async create(createQuestionDto: any) {
    let array = [];
    let sId = createQuestionDto[0].syllabus[0]
    var data = await this.questionModel.find({ syllabus: sId + '' }).exec();
    let syllabusData = await this.SyllabusModel.findById({ _id: sId });
    let code = syllabusData.shortcut;
    let uniqueCode: string;
    createQuestionDto.map((res, i) => {
      let num = data.length + i + 1
      if (num > 0 && num <= 9)
        uniqueCode = code + "0000" + num;
      else if (num > 9 && num <= 99)
        uniqueCode = code + "000" + num;
      else if (num > 99 && num <= 999)
        uniqueCode = code + "00" + num;
      else if (num > 999 && num <= 9999)
        uniqueCode = code + "0" + num;
      else
        uniqueCode = code + num;
      console.log('num', num, i + 1);

      res.questionId = uniqueCode
      array.push(res)
    })
    let QData = await this.questionModel.insertMany(array);
    let PData
    PData = QData
    console.log('PData', PData);
    //  console.log('QDataresponse',PData.response);

    PData.map(resp => {
      resp.perals.map(per => {
        this.assignPeral(per, resp._id)
      })
    })
    return QData

    // let createdQuestion = new this.questionModel(createQuestionDto);
    // createdQuestion.questionId = uniqueCode
    // const result = createdQuestion.save();
    //  return result;

  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find()
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          // "flags.questionBank": true ,
          'flags.active': true
        },
        select: {
          "_id": 1,
          "uuid": 1,
          "title": 1,
          "type": 1,

        }
      })
      .populate({
        path: 'perals',
        model: "Pearls",
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      })
      .populate({
        path: "tags",
        model: "Tags",
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      })
      .exec();
    //.populate('syllabus').exec();
  }

  async updateShortTitle(questions) {
    // let queData =await this.questionModel.find({mathType:'no'},{uuid:1,title:1}).exec();
    // console.log('queData',queData);
    // queData.map(res=>{
    //   this.questionModel.findOneAndUpdate({ uuid: res.uuid }, {shortTitle:res.title.replace(/<(.|\n)*?>/g, '').trim()}).exec();
    // })
    let flags = {
      pro: false,
      editable: true,
      active: true,
      qBank: true,
      testSeries: true,
      paid:true
    }
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      var checkQuestion = await this.questionModel.findOne({ uuid: question['uuid'],mathType:'no' }).exec();
      if (checkQuestion) {
        checkQuestion.options.map((res,i)=>{
          checkQuestion.options[i].name =  res.name ?res.name:'';
          checkQuestion.options[i].imgUrl = res.imgUrl ?res.imgUrl:'';
          return checkQuestion.options[i].value = i+1
        })
        this.questionModel.findOneAndUpdate({ uuid: checkQuestion.uuid },{
          shortTitle:checkQuestion.title.replace(/<(.|\n)*?>/g, '').trim(),
          options:checkQuestion.options,
          flags:flags
        }).exec();
      }
    }

  }

  async findAllBySyllabusId(syllabusId: string): Promise<Question[]> {
    return this.questionModel.find({ syllabus: syllabusId }).
      populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          "flags.questionBank": true,
          'flags.active': true
        },
        select: {
          "title": 1,
        }
      })
      .populate({
        path: 'perals',
        model: "Pearls",
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      })
      .populate({
        path: 'tags',
        model: "Tags",
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      })
      .exec();
  }

  async findByUuid(uuid: string): Promise<Question> {
    return this.questionModel.findOne({ uuid })
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          // "flags.questionBank": true ,
          'flags.active': true
        },
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      })
      .populate({
        path: 'perals',
        model: "Pearls",
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      })
      .populate({
        path: "tags",
        model: "Tags",
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      })
      .exec();
    // .populate('syllabus').exec();
  }

  async assignPeral(peralId: string, queId: string) {
    console.log('peralIdperalId', peralId, queId);
    return this.pearlsModel.findOneAndUpdate(
      { _id: peralId },
      { $push: { "queIds": queId } }
    ).exec();
  }
  async deletePeral(peralId: string, queId: string) {
    console.log('deletePeralIdperalId', peralId, queId);
    return this.pearlsModel.findOneAndUpdate(
      { _id: peralId },
      { $pull: { "queIds": queId } }
    ).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.questionModel.findOneAndDelete({ uuid }).exec();
  }

  async editByUuid(request: any) {
    console.log('request', request);
    request?.insertPeralArray.map(per => {
      this.assignPeral(per, request._id)
    })
    request?.deletePeralArray.map(per => {
      this.deletePeral(per, request._id)
    })
    return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async editQuestionByJsonFile(request: any) {
    return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async qbankAddQuestions(request: QbankQuestionInterface): Promise<any> {
    console.log('requestData', request);
    let array = []
    let sId = request.que[0].syllabus[0]
    var data = await this.questionModel.find({ syllabus: sId + '' }).exec();
    let syllabusData = await this.SyllabusModel.findById({ _id: sId });
    let code = syllabusData.shortcut;
    let uniqueCode: string;
    request.que.map((res, i) => {
      let num = data.length + i + 1
      if (num > 0 && num <= 9)
        uniqueCode = code + "0000" + num;
      else if (num > 9 && num <= 99)
        uniqueCode = code + "000" + num;
      else if (num > 99 && num <= 999)
        uniqueCode = code + "00" + num;
      else if (num > 999 && num <= 9999)
        uniqueCode = code + "0" + num;
      else
        uniqueCode = code + num;
      res.questionId = uniqueCode
      array.push(res)
    })
    this.questionModel.insertMany(array)


    // this.questionModel.insertMany(request.que);
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.qbank_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[chelem].topics.$[telem].que": { $each: request.qbank_que } },

        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.qbank_chapter } },
          { "telem.uuid": { $eq: request.qbank_topic } }
          ]
        },

      )
      .exec();
    // return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }


  async qbankBulkAddQuestions(request: any): Promise<any> {
    let questionsList = [];
    let array = [];
    let questions = request.que;
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      // var string = questions[i]['title'].replace(/<\/?[^>]+(>|$)/g, "");
      var checkQuestion = await this.questionModel.findOne({ title: question['title'] }).exec();
      if (checkQuestion) {
        questionsList.push({ "uuid": checkQuestion.uuid, 'order': question['order'] });
        var notExist = false;
        checkQuestion.syllabus.forEach(data => {
          if (data.toString() != question.syllabus[0].toString()) {
            notExist = true;
          } else {
            notExist = false;
          }
        })
        if (notExist) {
          checkQuestion.syllabus.push(question.syllabus[0])
          checkQuestion.modifiedOn = request.date;
          this.questionModel.findOneAndUpdate({ uuid: checkQuestion.uuid }, checkQuestion).exec();
        }
      }
      else {
        questionsList.push({ "uuid":  question['uuid'], 'order': question['order'] });

        let sId = question.syllabus[0]
        var data = await this.questionModel.countDocuments({ syllabus: sId + '' }).exec();
        let syllabusData = await this.SyllabusModel.findById({ _id: sId },{shortcut:1});
        let code = syllabusData.shortcut;
        let uniqueCode: string;
        let num = data + i + 1
        if (num > 0 && num <= 9)
          uniqueCode = code + "0000" + num;
        else if (num > 9 && num <= 99)
          uniqueCode = code + "000" + num;
        else if (num > 99 && num <= 999)
          uniqueCode = code + "00" + num;
        else if (num > 999 && num <= 9999)
          uniqueCode = code + "0" + num;
        else
          uniqueCode = code + num;
        question.questionId = uniqueCode
        array.push(question)
      }
    };
     this.questionModel.insertMany(array)
     this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.qbank_subject
        },
        {
          $push: { "chapters.$[chelem].topics.$[telem].que": { $each: questionsList } },
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.qbank_chapter } },
          { "telem.uuid": { $eq: request.qbank_topic } }
          ]
        },
      )
      .exec();
      return []

  }

  async testBulkAddQuestions(request: any): Promise<any> {
    let questionsList = [];
    let array = [];
    let questions = request.que;
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      // var string = questions[i]['title'].replace(/<\/?[^>]+(>|$)/g, "");
      var checkQuestion = await this.questionModel.findOne({ title: question['title'] }).exec();

      if (checkQuestion) {
        questionsList.push({ "uuid": checkQuestion.uuid,'order': question['order'],'positive': 1, 'negative': 0 });
        var notExist = false;
        checkQuestion.syllabus.forEach(data => {
          if (data.toString() != question.syllabus[0].toString()) {
            notExist = true;
          } else {
            notExist = false;
          }
        })
        if (notExist) {
          checkQuestion.syllabus.push(question.syllabus[0])
          checkQuestion.modifiedOn = request.date;
          this.questionModel.findOneAndUpdate({ uuid: checkQuestion.uuid }, checkQuestion).exec();
        }
      }
      else {
        questionsList.push({ "uuid":  question['uuid'],'order': question['order'],'positive': 1, 'negative': 0 });
        let sId = question.syllabus[0]
        var data = await this.questionModel.countDocuments({ syllabus: sId + '' }).exec();
        let syllabusData = await this.SyllabusModel.findById({ _id: sId },{shortcut:1});
        let code = syllabusData.shortcut;
        let uniqueCode: string;
        let num = data + i + 1
        if (num > 0 && num <= 9)
          uniqueCode = code + "0000" + num;
        else if (num > 9 && num <= 99)
          uniqueCode = code + "000" + num;
        else if (num > 99 && num <= 999)
          uniqueCode = code + "00" + num;
        else if (num > 999 && num <= 9999)
          uniqueCode = code + "0" + num;
        else
          uniqueCode = code + num;
        question.questionId = uniqueCode
        array.push(question)
      }
    };
    this.questionModel.insertMany(array)
    // await this.questionModel.insertMany(array)
     this.TSCategoriesModel
    .findOneAndUpdate(
      {
        uuid: request.ts_uuid
      },
      // filter and push to the object
      {
        $push: { "categories.tests.$[telem].que": { $each: questionsList } },
      },
      {
        arrayFilters: [
          { "telem.uuid": { $eq: request.test } }
        ]
      },
    )
    .exec();
    return []

  }

  async testSeriesAddQuestions(request: TestSeriesQuestionInterface): Promise<any> {
    if (request.que.length) {
      let array = []
      let sId = request.que[0].syllabus[0]
      var data = await this.questionModel.find({ syllabus: sId + '' }).exec();
      let syllabusData = await this.SyllabusModel.findById({ _id: sId });
      let code = syllabusData.shortcut;
      let uniqueCode: string;
      request.que.map((res, i) => {
        let num = data.length + i + 1
        if (num > 0 && num <= 9)
          uniqueCode = code + "0000" + num;
        else if (num > 9 && num <= 99)
          uniqueCode = code + "000" + num;
        else if (num > 99 && num <= 999)
          uniqueCode = code + "00" + num;
        else if (num > 999 && num <= 9999)
          uniqueCode = code + "0" + num;
        else
          uniqueCode = code + num;
        res.questionId = uniqueCode
        array.push(res)
      })
      this.questionModel.insertMany(array)
    }
    // this.questionModel.insertMany(request.que);
    return this.TSCategoriesModel
      .findOneAndUpdate(
        {
          uuid: request.ts_uuid
        },
        // filter and push to the object
        {
          $push: { "categories.tests.$[telem].que": { $each: request.test_que } },
        },
        {
          arrayFilters: [
            { "telem.uuid": { $eq: request.test } }
          ]
        },
      )
      .exec();
    // return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async checkQuestionBeforeAdd(request: any) {
    var que_obj = await this.questionModel.findOne({ "title": request.title }, { title: 1 }).exec();
    //console.log(que_obj);
    //return que_obj;
    if (que_obj)
      return true;
    else
      return false;
  }

  async questionSearch(request: any) {
    return this.questionModel.find({
      "$or": [{
        "title": { '$regex': request.search, '$options': 'i' }
      },
        {
          "shortTitle": {'$regex': request.search, '$options': 'i'}
      }, {
          "questionId": {'$regex': request.search, '$options': 'i'}
      },{
        "previousAppearances": {'$regex': request.search, '$options': 'i'}
    }]
  });
    // if( request.shortTitle){
    //   return this.questionModel.find({ "shortTitle": request.shortTitle }).exec(); 
    // }
    // else  if( request.questionId){
    //   return this.questionModel.find({ "questionId": request.questionId }).exec(); 
    // }
  }

}
