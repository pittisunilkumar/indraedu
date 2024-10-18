import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { SuggestedTests } from '../schema/suggested-tests.schema';
import { TSCategories } from '../schema';

@Injectable()
export class SuggestedTestsService {

    constructor(
        @InjectModel('SuggestedTests') private suggestedTestsModel: Model<SuggestedTests>,
        @InjectModel('TSCategories') private testSeriesModel: Model<TSCategories>,

    ) { }

    async create(request) {
        // let request=  requ.CreateSuggestedTestsDto
        let courseId = request.courseId;
        let categoryId = request.categoryId;
        let testUuid = request.testUuid;
        let status = request.status;

        let testData: any;

        testData = await this.suggestedTestsModel.find(
            {
                "courseId": courseId,
                "categoryId": categoryId,
                "testUuid": testUuid
            }
        ).exec();
        console.log('testData', testData);

        if (testData.length > 0) {

            this.suggestedTestsModel.findOneAndUpdate(
                // filter and push to the object
                { courseId: courseId, categoryId: categoryId, testUuid: testUuid },

                // filter and set to the object
                {
                    $set: { "status": status },
                },

            ).exec();
            return testData

        } else {
            console.log('requestrequest', request);

            const createdSuggestedTests = new this.suggestedTestsModel(request);
            const result = await createdSuggestedTests.save();
            return result
        }

    }

    async updateStatus(id, status) {
        return this.suggestedTestsModel.findOneAndUpdate(
            { _id: id },
            {
                "status": status.status,
            },
        ).exec();
    }

    async findAll(): Promise<SuggestedTests[]> {
        //return 1;
        let new_result = [];
        await this.suggestedTestsModel.find()
            .populate({
                path: 'courseId',
                select: {
                    "uuid": 1,
                    "title": 1,
                    "_id": 1,
                }
            })
            .populate({
                path: 'categoryId',
                select: {
                    "uuid": 1,
                    "categories.title": 1,
                    "_id": 1,
                }
            })
            .exec().then(async tests => {
                for (var k = 0; k < tests.length; k++) {
                    let testss = await this.testSeriesModel
                        .aggregate([
                            { $match: { "categories.tests.uuid": tests[k]['testUuid'] } },
                            { $unwind: "$categories" },
                            {
                                $addFields: {
                                    "categories.tests": {
                                        $filter: {
                                            input: "$categories.tests",
                                            cond: { $eq: ["$$this.uuid", tests[k]['testUuid']] }
                                        }
                                    }
                                }
                            }
                        ])
                        .exec()
                        .then(res => {
                            let totalres = res.filter(it => it.categories.tests.length > 0)[0].categories.tests[0];
                            return { title: totalres.title, uuid: totalres.uuid };
                        })
                        .catch(err => err);

                    new_result.push({
                        _id: tests[k]._id,
                        course: tests[k].courseId,
                        category: tests[k].categoryId,
                        test: testss,
                        status: tests[k].status,
                        createdOn: tests[k].createdOn
                    })
                };

            }).catch(err => err);

        return new_result;
    }


}