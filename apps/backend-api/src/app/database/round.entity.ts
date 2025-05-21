import { IsUUID, IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('round', { comment: 'Раунды The Last of Guss' })
export class RoundEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Идентификатор раунда',
    format: 'uuid',
  })
  @IsUUID('all')
  id!: string;

  @Column({ type: 'timestamp', nullable: false })
  @ApiProperty({
    description: 'Время создания',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @IsDateString({ strict: false })
  startTime!: Date;

  @Column({ type: 'timestamp', nullable: false })
  @ApiProperty({
    description: 'Время окончания',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @IsDateString({ strict: false })
  endTime!: Date;

  @Column({ type: 'integer', nullable: false })
  @ApiProperty({
    description: 'Общее количество очков',
    example: 1,
    type: 'integer',
    required: true,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  score!: number;

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
