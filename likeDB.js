/**
 * @class likeDB
 * @author   Hassani Mohammed El Habib <https://github.com/Mouhamedtec>
 * @license  MIT
 */
class likeDB {
    /**
     * Constructor
     *
     */
    constructor(DBS) {

        this.DBS = DBS;

        /**
         *  defining database schema
         *
         */
        this.dbSchema = {
            tables: [] // database tables
        };

        /**
         * defining table schema
         *
         */
        this.tableSchema = {
            tbName: String,
            tbFields: [],
            tbRows: []
        };

        /**
         * defining field schema
         *
         */
        this.fieldSchema = {
            pk: false,
            n: "",
            t: null,
            u: false,
            d: null // default
        };

        if (typeof DBS === 'undefined' || !DBS.trim().length)
            throw new Error('No Database Selected');
    }


    /**
     * provide a way to convert the localStorage (database) value to javaScript object notation (JSON)
     * @returns {Object} database object
     */
    getDB() {
        const _DB = JSON.parse(localStorage.getItem(this.DBS.toString()));
        if (_DB)
            return _DB;
        return [];
    }


    /**
     * Check if the table exists in the database
     *
     * @param {String} t - name of the table
     *
     * @throws Throw an error if no arguments are found.
     * @throws Throw an error if the database does not exist.
     * @throws Throw an error if the database does not contain any tables.
     * @return {Boolean} true if table exists.
     *
     */
    isTableExists(t) {
        const _DB = this.getDB();

        if (typeof t === 'string' && t.trim().length !== 0) {

            if (!Object.values(_DB).length)
                throw Error('No database was found with the name "' + this.DBS + '"');

            // if (!_DB.tables.length) throw Error('No table was found in database "' + DBS + '"');
            return (_DB.tables.map(tb => tb.tbName === t).includes(true) === true) ? true : false;

        } else {
            throw Error('Table Name is missing !');
        }
        // throw Error("Table Name is missing !");
        // return (Object.values(this.getDB() !== null ? this.getDB().tables : []).map(tb => tb.tbName === t).includes(true) === true) ? true : false;
    }


    /**
     * Check if the field exists in the table
     *
     * @param {Object} _fields - object of fields from table
     * @param {String} _fname  - field name
     * @return {Boolean} true if field exists.
     *
     */
    isFieldExists(_fields, _fname) {
        return _fields.map(f => f.n === _fname).includes(true) === true;
    }


    /**
     * The createDB() is used to create a new localStorage database.
     *
     * @throws Throw an error if the database name already exists
     * @throws Throw an error if the create fails
     * @return {Boolean} true if database have been created successfully
     *
     */
    createDB() {
        if (Object.values(this.getDB()).length)
            throw new Error('Database "' + this.DBS + '"already exists, Try with diffrent database name');
        try {
            localStorage.setItem(this.DBS.toString(), JSON.stringify(this.dbSchema));
            return true;
        } catch (error) {
            throw Error(error);
        }
    }


    /**
     * The dropDB() is used to drop an existing localStorage database.
     *
     * @throws Throw an error if the database does not exist
     * @throws Throw an error if the drop fails
     * @return {Boolean} true if database dropped successfully
     *
     */
    dropDB() {
        if (!Object.values(this.getDB()).length)
            throw Error('No database was found with the name "' + this.DBS + '"');
        try {
            localStorage.removeItem(this.DBS);
            return true;
        } catch (error) {
            throw Error('Drop failed for database "' + this.DBS + '"');
        }
    }


    /**
     * The createTable() is used to create a new table in localStorage database.
     *
     * @param {String} table table name
     *
     * @throws Throw an error if the database does not exist
     * @throws Throw an error if the table name already exists
     * @throws Throw an error if the create fails
     * @return {Boolean} true if table created successfully
     *
     */
    createTable(table) {
        const _DB = this.getDB();
        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        if (this.isTableExists(table) === true) {
            throw Error('Table "' + table + '" already exists, Try with diffrent database name');
        } else {
            this.tableSchema.tbName = table.toString();
            _DB.tables.push(this.tableSchema);

            try {
                localStorage.setItem(this.DBS, JSON.stringify(_DB));
                return true;
            } catch (error) {
                throw Error('An error occurred while creating the table');
            }
        }
    }


    /**
     * The dropTable() is used to drop an existing localStorage table.
     *
     * @param {String} table table name
     *
     * @throws Throw an error if the database does not exist
     * @throws Throw an error if a table with the supplied name is not found
     * @throws Throw an error if the drop fails
     * @return {Boolean} true if table dropped successfully
     *
     */
    dropTable(table) {
        const _DB = this.getDB();
        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        if (this.isTableExists(table) === true) {
            _DB.tables = _DB.tables.filter(x => x.tbName !== table);
            try {
                localStorage.setItem(this.DBS, JSON.stringify(_DB));
                return true;
            } catch (error) {
                throw Error('An error occurred while try to drop the table "' + table + '" ');
            }
        } else {
            throw Error('No table was found with the name "' + table + '"');
        }
    }


    /**
     * The createField() is used to create a new field in specific table.
     *
     * @param {String} _table table name
     * @param {String} _name field name
     * @param {any} _type type of field
     * @param {boolean} _isnull if a field is optional
     * @param {String} table table name
     *
     * @throws Throw an error if no arguments are found,
     * @throws Throw an error if the database does not exist
     * @throws Throw an error if some arguments are missing or not properly set
     * @return {Object} created field object
     *
     */
    createField(_table = "", _name = "", _type = "", _isnull = true, _default = "", _pk = false) {
        if (!arguments.length)
            throw Error('No arguments were supplied');

        const _DB = this.getDB();
        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        if (typeof _table === 'string' && _table.length !== 0 && typeof _name === 'string' && _name.length !== 0 && typeof _pk === 'boolean') {

            if (this.isTableExists(_table) === true) {
                // TO-DO check for FOREIGN KEY
                var tb = _DB.tables.find(ts => ts.tbName === _table);

                if (this.isFieldExists(tb.tbFields, _name) === false) {

                    this.fieldSchema.n = _name;
                    this.fieldSchema.t = _type;
                    this.fieldSchema.u = _isnull === true || _isnull === false ? _isnull : false;
                    this.fieldSchema.d = _default.length !== 0 ? _default : null;
                    this.fieldSchema.pk = _pk === true || _pk === false ? _pk : false;

                    tb.tbFields.push(this.fieldSchema);

                    try {
                        localStorage.setItem(this.DBS, JSON.stringify(_DB));
                        return tb.tbFields.at(-1);
                        // return tb.tbFields.map(e => e.n).indexOf(_name);
                    } catch (error) {
                        throw Error('An error occurred while creating the Field');
                    }

                } else {
                    throw Error('A field with the name "' + _name + '" already exists, Please Try with diffrent field name');
                }

            } else {
                throw Error('No table was found with the name "' + _table + '"');
            }
        } else {
            throw Error('some arguments are missing or not properly set');
        }
    }


    /**
     * The dropField() is used to drop an existing table field.
     *
     * @param {String} table table name
     * @param {String} field field name
     *
     * @throws Throw an error if no arguments are found.
     * @throws Throw an error if the database does not exist.
     * @throws Throw an error if a table with the supplied name is not found.
     * @throws Throw an error if the drop fails.
     * @return {Boolean} true if field dropped successfully.
     *
     */
    dropField(table = "", field = "") {
        if (!arguments.length)
            throw Error('No arguments were supplied');

        const _DB = this.getDB();
        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        if (this.isTableExists(table) === true) {
            _DB.tables.filter(function (t) {
                if (t.tbName === table)
                    (t.tbFields = t.tbFields.filter(f => f.n !== field)) && (t.tbRows = t.tbRows.filter(f => !f.hasOwnProperty(field)));
            });
            try {
                localStorage.setItem(this.DBS, JSON.stringify(_DB));
                return true;
            } catch (error) {
                throw Error('An error occurred while try to drop field from the table "' + table + '" ');
            }
        } else {
            throw Error('No table was found with the name "' + table + '"');
        }

    }


    /**
     * The insert() is used to insert new records in a specific table.
     * @param {String} _table table name
     *
     * @throws Throw an error if no arguments are found.
     * @throws Throw an error if the database does not exist.
     * @throws Throw an error if a table with the supplied name is not found.
     * @throws Throw an error if some arguments are missing or not properly set.
     * @return {Object} created record object
     *
     */
    insert(_table, ...[_fields]) {
        if (!arguments.length)
            throw Error('No arguments were supplied');

        const _DB = this.getDB();

        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        const cl = [];

        if (this.isTableExists(_table) === true) {

            if (typeof _fields !== 'object' || typeof _fields === 'object' && Object.values(_fields).length === 0)
                throw Error('Fields are missing or not properly set');

            var isFieldExists = this.isFieldExists;

            _DB.tables.find(function (t) {
                if (t.tbName === _table) {
                    var fi = t.tbFields;

                    if (!fi.length)
                        throw Error('Table "' + _table + '" has no Fields associated with it.');

                    var len = [];
                    for (let i = 0, field = Object.entries(_fields); i < field.length; i++) {
                        fi.filter(f => f.n === field[i][0]).length;
                        if (fi !== 0) {
                            len.push(fi.length);
                        }
                        if (!isFieldExists(fi, field[i][0])) {
                            throw Error('Table has no fields with the name "' + field[i][0] + '" .');
                        }
                    }

                    if (len.length === fi.length)
                        t.tbRows.push(_fields) && cl.push(t.tbRows.at(-1));
                }
            });

            try {
                localStorage.setItem(this.DBS, JSON.stringify(_DB));
            } catch (error) {
                throw Error('An error occurred while inserting to table "' + _table + '"');
            }

        } else {
            throw Error('No table was found with the name "' + _table + '"');
        }

        return cl.length ? cl[0] : null;
    }


    /**
     * The select() is used to select data from a specific table.
     * @param {String} _table table name
     *
     * @throws Throw an error if no arguments are found.
     * @throws Throw an error if the database does not exist.
     * @throws Throw an error if a table with the supplied name is not found.
     * @return {Object} results
     *
     */
    select(_table, ...[_fields]) {
        if (!arguments.length)
            throw Error('No arguments were supplied');

        const _DB = this.getDB();

        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        const rs = [];

        if (this.isTableExists(_table) === true) {

            _DB.tables.filter(function (t) {
                if (t.tbName === _table) {
                    t.tbFields = t.tbFields.filter(f => _fields.includes(f.n));
                    _fields.map(function (fl, i) {
                        t.tbRows.filter(function (r) {
                            var b = {};
                            if (typeof r[fl] !== 'undefined') {
                                b[fl] = r[fl];
                                rs.push(b);
                            }
                        });
                    });
                }
            });
        } else {
            throw Error('No table was found with the name "' + _table + '"');
        }

        return rs;
    }


    /**
     * The update() is used to modify the existing records in a table.
     * @param {String} _table table name
     * @param {Object} condition The object containing the property name and value to comparewith the records in the table
     *
     * @throws Throw an error if no arguments are found.
     * @throws Throw an error if the database does not exist.
     * @throws Throw an error if a table with the supplied name is not found.
     * @throws Throwing an error if the fields to be updated are incorrect or missing.
     * @throws Throw an error if the update fails.
     * @return true if records have been updated successfully
     *
     */
    update(_table, condition, ...[_fields]) {
        if (!arguments.length)
            throw Error('No arguments were supplied');

        const _DB = this.getDB();

        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        if (this.isTableExists(_table) === true) {

            _DB.tables.filter(function (t) {
                if (t.tbName === _table) {
                    t.tbFields = t.tbFields.filter(f => Object.keys(_fields).includes(f.n));
                    if (Object.values(t.tbFields).length) {
                        t.tbRows.filter(function (rw) {
                            const isEqual = Object.keys(rw).includes(Object.keys(condition).toString()) && Object.values(rw).includes(Object.values(condition).toString()) ? true : false;
                            // if (typeof condition[x] !== 'undefined'){ # OLD
                            if (isEqual) {
                                for (let z in _fields) {
                                    if (typeof rw[z] !== 'undefined')
                                        rw[z] = _fields[z];
                                }
                            }
                        });
                    } else {
                        throw Error('Mismatch error, please check for fields name are same as in table.');
                    }
                }
            });

            try {
                localStorage.setItem(this.DBS, JSON.stringify(_DB));
                return true;
            } catch (error) {
                throw Error('An error occurred while trying to update');
            }

        } else {
            throw Error('No table was found with the name "' + _table + '"');
        }
    }


    /**
     * The delete() is used to delete existing records in a table.
     * @param {String} _table table name
     * @param {Object} condition The object containing the property name and value to comparewith the records in the table
     *
     * @throws Throw an error if no arguments are found.
     * @throws Throw an error if the database does not exist.
     * @throws Throw an error if a table with the supplied name is not found.
     * @throws Throw an error if the delete fails.
     * @return true if records have been deleted successfully.
     *
     */
    delete(_table, condition) {
        if (!arguments.length)
            throw Error('No arguments were supplied');

        const _DB = this.getDB();

        if (!Object.values(_DB).length)
            throw Error('No database was found with the name "' + this.DBS + '"');

        if (this.isTableExists(_table) === true) {

            _DB.tables.filter(function (t) {
                if (t.tbName === _table) {
                    t.tbRows = t.tbRows.filter(function (r) {
                        for (let c in condition) {
                            if (r[c] === condition[c])
                                return r[c] !== condition[c];
                        }
                        return r;
                    });
                }
            });

            try {
                localStorage.setItem(this.DBS, JSON.stringify(_DB));
                return true;
            } catch (error) {
                throw Error('An error occurred while trying to delete');
            }

        } else {
            throw Error('No table was found with the name "' + _table + '"');
        }
    }
}
