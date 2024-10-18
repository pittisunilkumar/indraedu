import { Injectable } from '@nestjs/common';
import { ObjectID } from 'mongodb';

@Injectable()
export class MoveDocumentsInBulkService {

  insertBatch(collection, documents) {

    const bulkInsert = collection.initializeUnorderedBulkOp();
    const insertedIds = [];
    let id: ObjectID;
    documents.forEach(function(doc) {
      id = doc._id;
      // Insert without raising an error for duplicates
      bulkInsert.find({_id: id}).upsert().replaceOne(doc);
      insertedIds.push(id);
    });
    bulkInsert.execute();
    return insertedIds;

  }

  deleteBatch(collection, documents) {

    const bulkRemove = collection.initializeUnorderedBulkOp();
    documents.forEach(function(doc) {
      bulkRemove.find({_id: doc._id}).removeOne();
    });
    bulkRemove.execute();

  }

  moveDocuments(sourceCollection, targetCollection, filter, batchSize) {

    console.log("Moving " + sourceCollection.find(filter).count() + " documents from " + sourceCollection + " to " + targetCollection);
    let count;
    while ((count = sourceCollection.find(filter).count()) > 0) {
      console.log(count + " documents remaining");
      const sourceDocs = sourceCollection.find(filter).limit(batchSize);
      const idsOfCopiedDocs = this.insertBatch(targetCollection, sourceDocs);

      const targetDocs = targetCollection.find({_id: {$in: idsOfCopiedDocs}});
      this.deleteBatch(sourceCollection, targetDocs);
    }
    console.log("Done!");

  }

}
