<?php

namespace App\Console\Commands\Install;

use Illuminate\Console\Command;

class Country extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'install:country';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->installCountry();
    }

    public function installCountry()
    {

    }
}
