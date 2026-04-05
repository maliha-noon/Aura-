<?php
$hosts = ['127.0.0.1', 'localhost'];
$passwords = ['', 'password', 'root'];
$user = 'root';

foreach ($hosts as $host) {
    foreach ($passwords as $pass) {
        try {
            echo "Trying: host=$host, user=$user, pass='$pass'... ";
            $pdo = new PDO("mysql:host=$host", $user, $pass, [PDO::ATTR_TIMEOUT => 2]);
            echo "SUCCESS!\n";
            exit(0);
        } catch (PDOException $e) {
            echo "FAILED: " . $e->getMessage() . "\n";
        }
    }
}
echo "All combinations failed.\n";
exit(1);
?>
