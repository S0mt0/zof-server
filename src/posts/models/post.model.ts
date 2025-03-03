// import {
//   Table,
//   Column,
//   Model,
//   ForeignKey,
//   BelongsTo,
//   DataType,
// } from 'sequelize-typescript';
// import { User } from '../../users/database/schemas/user.model';

// @Table({
//   timestamps: true,
//   createdAt: 'joinedAt',
// })
// export class Post extends Model {
//   @Column({
//     type: DataType.UUID,
//     primaryKey: true,
//     unique: true,
//     defaultValue: DataType.UUIDV4,
//   })
//   readonly id!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   title: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   content: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   imageUrl: string;

//   @ForeignKey(() => User)
//   @Column(DataType.UUID)
//   userId: string;

//   @BelongsTo(() => User)
//   user: User;
// }
