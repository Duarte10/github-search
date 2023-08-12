interface IRepository {
    name: string;
    shortDescriptionHTML: string;
    ownerAvatarUrl: string;
    id: string;
}

interface IStarredRepository extends IRepository {
    rating: number | null;
}

export type { IRepository, IStarredRepository };