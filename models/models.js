const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
});

const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    like: { type: DataTypes.INTEGER, defaultValue: 0 },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false }
});

const Like = sequelize.define('like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false }
});

const Tag = sequelize.define('tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { timestamps: false });

const PostTag = sequelize.define('post_tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { timestamps: false });

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Like);
Like.belongsTo(User);

Post.hasMany(Like);
Like.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User);

Tag.belongsToMany(Post, { through: PostTag });
Post.belongsToMany(Tag, { through: PostTag });


module.exports = { User, Post, Like, Comment, Tag, PostTag };