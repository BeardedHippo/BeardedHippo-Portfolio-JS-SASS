<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/Exception.php';

if(isset($_POST['token']))
{

    $secretKey = '';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'secret' => $secretKey,
        'response' => $_POST['token']
    ]);

    $resp = json_decode(curl_exec($ch));
    curl_close($ch);

    if ($resp->success) {

        $mail = new PHPMailer(true);

        try {
            $postName = $_POST['post-name'];
            $postMail = $_POST['post-mail'];
            $postSubject = $_POST['post-subject'];
            $postBody = $_POST['post-body'];

            $mail->setFrom('', $postName);
            $mail->addAddress('', '');
            $mail->addReplyTo($postMail, $postName);

            $mail->isHTML(true);
            $mail->Subject = $postSubject;
            $mail->Body    = $postBody;
            $mail->AltBody = $postBody;

            $mail->send();

            echo 'succes';
        } catch (Exception $e) {
            echo 'm-error';
        }

    } else {
        echo 'r-error';
    }
}

?>