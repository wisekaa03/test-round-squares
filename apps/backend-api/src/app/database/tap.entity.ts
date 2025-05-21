import { IsUUID, IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { RoundEntity } from './round.entity';

@Entity('tap', { comment: 'Тапы и очки по раундам' })
export class TapEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Идентификатор тапов',
    format: 'uuid',
  })
  @IsUUID('all')
  id!: string;

  @Column({ type: 'integer', nullable: false })
  @ApiProperty({
    description: 'Количество очков в раунде',
    example: 1,
    type: 'integer',
    required: true,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  score!: number;

  @Column({ type: 'integer', nullable: false })
  @ApiProperty({
    description: 'Общее количество тапов',
    example: 1,
    type: 'integer',
    required: true,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  tap!: number;

  @ManyToOne(() => RoundEntity, (round) => round.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  round?: RoundEntity;

  @Column({ type: 'uuid' })
  @RelationId((tap: TapEntity) => tap.round)
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Раунд ID',
  })
  @IsUUID('all')
  roundId!: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  user?: UserEntity;

  @Column({ type: 'uuid' })
  @RelationId((tap: TapEntity) => tap.user)
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Пользователь ID',
  })
  @IsUUID('all')
  userId!: string;

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
