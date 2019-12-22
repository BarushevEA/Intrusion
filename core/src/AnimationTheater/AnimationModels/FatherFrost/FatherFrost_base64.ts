class FatherFrost_base64 {
    getInstance(): string {
        return 'data:image/png;charset=utf-8;base64,' +
            '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';
    }
}

export const fatherFrost_base64 = new FatherFrost_base64();
