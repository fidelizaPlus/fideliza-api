export class Campaign {
  constructor(
    readonly id: string,
    readonly managerId: string,
    readonly title: string,
    readonly description: string,
    readonly status: string,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly deletedAt?: Date,
    readonly finishedAt?: Date,
  ) {}
}
