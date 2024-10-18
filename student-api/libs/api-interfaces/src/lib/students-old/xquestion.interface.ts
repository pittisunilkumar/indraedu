export interface XQuestionInterface {
    id?: number;
    title: string;
    image: string;
    options: string;
    optionImage: string;
    solution: string;
    solutionDescription: string;
    solutionImageDescription: string;
    solutionImage: string;
    year: number;
    previousApperances: string;
    difficulty: DifficultyEnum;
    reference: string;
    tags: string;
}

enum DifficultyEnum {
    easy = 1,
    medium = 2,
    hard = 3,
}