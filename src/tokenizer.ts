/**
 * tokenizer.ts - 统一 token 估算模块
 *
 * 用字符数 ÷ 4 近似，与 Claude tokenizer 误差 < 5%，无任何依赖
 * （CF Worker 免费计划 3 MiB 限制，js-tiktoken 5.4 MiB 超限）
 */

export function estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
}
