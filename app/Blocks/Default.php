<?php

namespace App\Blocks;

use BlockHandler\Contracts\BlockHandler;

class Default implements BlockHandler
{
    public function __invoke($block_content, $block)
    {
        return view('blocks.default', [
            'title' => $block['attrs']['title'] ?? null,
        ]);
    }
}
