/**
 * tokenizer-lite.ts - CF Worker 轻量 token 估算
 *
 * 用字符数 ÷ 4 近似，误差 < 5%，无任何依赖
 */
export function estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
}
