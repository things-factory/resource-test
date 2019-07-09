import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Resource } from '@things-factory/resource-base'
import { Domain } from '@things-factory/shell'
import { ENTITIES as SEED_ENTITIES } from '../seed-data/entities'

export class SeedEntity1556878324336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Resource)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      SEED_ENTITIES.forEach(async entity => {
        await repository.save({
          ...entity,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Resource)

    SEED_ENTITIES.reverse().forEach(async entity => {
      let record = await repository.findOne({ name: entity.name })
      let child = await repository.findOne({ name: `${entity.name}-detail` })

      await repository.remove(child)
      await repository.remove(record)
    })
  }
}
