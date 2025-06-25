import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';

import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
    { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
    eslint.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    eslintConfigPrettier,
    {
        rules: {}
    }
);