import * as mysql from 'mysql';
class DbBase {
    private readonly _connectConfig: mysql.PoolConfig;
    private readonly _poolConnect: mysql.Pool;
    constructor(connectConfig: mysql.PoolConfig) {
        this._connectConfig = connectConfig;
        this._poolConnect = mysql.createPool(this._connectConfig);
    }

    public query = async (sql: string, values:string[] | undefined) => {
        try {
            console.log(`[SQL Query]: ${sql} | values(${values.join('|')})`);
            return new Promise((resolve, reject) => {
                this._poolConnect.query(sql, values, (err, results, fields) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

        } catch (e) {
            throw e.message;
        }
    }

}

export default DbBase;
