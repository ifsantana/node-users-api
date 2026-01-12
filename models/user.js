module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'users',
        timestamps: false,
    });
}