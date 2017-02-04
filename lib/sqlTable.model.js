/**
 * Created by Amin on 04/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
/* Abstrac class
* to implement 'load' and 'save' methods
* that are shared between real classes
* that relies on 'importData' and 'exportData' in those classes
*/
module.exports = class SqlTable{
  constructor(tableName, idMember, idColumn, test=false){
    if(!tableName)
      throw 'Missing tableName in SqlTable class';

    if(!idMember)
      throw 'Missing idMember in SqlTable class';

    if(!idColumn)
      throw 'Missing idColumn in SqlTable class';

    this.tableName = tableName;
    this.idMember  = idMember;
    this.idColumn  = idColumn;
    this.sql = test ? sql.test : sql;
  }

  load(criteria) {
    return new env.promise((resolve, reject) => {
      this.sql[this.tableName].get(criteria)
        .then(data => {
          if(data.length>1)
            throw `More than one records with criteria: ${JSON(criteria)}`;

          this.importData(data[0]);
          resolve(data[0]);
        })
        .catch(reject);
    });
  }

  save() {
    return new env.promise((resolve, reject)=>
      this.exportData()
        .then(this[this.idMember] ?
          //Update
          data => {
            this.sql[this.tableName].update(data,this[this.idMember]).then(resolve(this[this.idMember])).catch(reject);
          }
          :
          //Insert
          data => {
          this.sql[this.tableName].add(data)
              .then(idData=>{
                let id=idData[this.idColumn];
                this[this.idMember]=id;
                resolve(id);
              })
              .catch(reject);
          }
        )
        .catch(reject));
  }

  importData(data){
    throw('importData is not implemented');
  }

  exportData(){
    throw('exportData is not implemented');
  }
};