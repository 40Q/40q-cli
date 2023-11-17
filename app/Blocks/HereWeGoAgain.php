<?php

namespace App\Blocks;

use BlockHandler\Contracts\BlockHandler;

class HereWeGoAgain implements BlockHandler
{
    public function __invoke($block_content, $block)
    {
        return view('blocks.here-we-go-again', [
            'title' => $block['attrs']['title'] ?? null,
        ]);
    }
}
