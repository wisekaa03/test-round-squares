import { IsString, IsUUID, MaxLength, IsDateString } from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('user', { comment: 'Пользователи' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Идентификатор пользователя',
    format: 'uuid',
  })
  @IsUUID('all')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  @Index('IDX_name', { unique: true })
  @ApiProperty({
    type: 'string',
    description: 'Имя',
    maxLength: 50,
    example: 'John',
    nullable: false,
    required: true,
  })
  @IsString()
  @MaxLength(50)
  name!: string;

  @Column({ select: false })
  @ApiHideProperty()
  password?: string;

  @Column({ type: 'varchar', nullable: false, comment: 'Роль пользователя' })
  @ApiProperty({
    description: 'Роль пользователя',
    type: 'string',
    required: true,
  })
  role!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    description: 'Время создания',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsDateString({ strict: false })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    description: 'Время изменения',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsDateString({ strict: false })
  updatedAt?: Date;
}
