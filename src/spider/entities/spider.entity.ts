import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert, PrimaryColumn } from "typeorm"

@Entity({ name: 'spider_website' })
export class Spider {
    @PrimaryColumn()
    @PrimaryGeneratedColumn()
    id: number

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
    website: string

    @Column()
    companyEstablished: string

    @Column()
    product: string

    @Column()
    keywords: string

    @Column()
    emails: string

    @Column()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date

    @Column()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date
}