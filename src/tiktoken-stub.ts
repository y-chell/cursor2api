/**
 * tiktoken-stub.ts - CF Worker 用，替换 js-tiktoken
 * 用字符数 ÷ 4 近似，无任何依赖，符合 CF Worker 3 MiB 限制
 */
export function getEncoding(_name: string) {
    return {
        encode: (text: string): ArrayLike<number> & { length: number } =>
            ({ length: Math.ceil(text.length / 4) }) as any,
    };
}
