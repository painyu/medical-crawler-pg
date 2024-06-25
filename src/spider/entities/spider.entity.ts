import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert } from "typeorm"

@Entity({ name: 'spider_website' })
export class Spider {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    companyId: string

    @Column()
    companyUrl: string

    @Column()
    companyName: string

    @Column()
    companyAddress: string

    @Column()
    businessScope: string

    @Column()
    scaleNum: string

    @Column()
    contactPerson: string

    @Column()
    position: string


    @Column()
    website: string

    @Column()
    companyEstablished: string

    @Column()
    product: string

    @Column()
    keywords: string

    @Column()
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date

    @Column()
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date
}