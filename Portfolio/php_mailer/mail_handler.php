<?php
require_once('email_config.php');
require('PHPMailer/PHPMailerAutoload.php');
$message = [];
$output = [
    'success' => null,
    'messages' => []
];
//name field
$message['name'] = filter_var($_POST['postName'], FILTER_SANITIZE_STRING);
if(empty($message['name'])){
    $output['success'] = false;
    $output['messages'][] = 'missing name key';
}
//email field
$message['email'] = filter_var($_POST['postEmail'], FILTER_SANITIZE_STRING);
if(empty($message['email'])){
    $output['success'] = false;
    $output['messages'][] = 'missing email key';
}
//message
$message['message'] = filter_var($_POST['postMessage'], FILTER_SANITIZE_STRING);
if(empty($message['message'])){
    $output['success'] = false;
    $output['messages'][] = 'missing comments key';
}
//subject
$message['subject'] = filter_var($_POST['postMessage'], FILTER_SANITIZE_STRING);

//phone
$message['phone'] = filter_var($_POST['postPhone'], FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/regex pattern here/']]);




if($output['success'] !== null){
    http_response_code(400);
    echo json_encode($output);
    // echo 'Sorry, there was an issue with the server, please try again later.';
    exit();
}

$mail = new PHPMailer;
$mail->SMTPDebug = 2;           // Enable verbose debug output. Change to 0 to disable debugging output.

$mail->isSMTP();                // Set mailer to use SMTP.
$mail->Host = 'smtp.gmail.com'; // Specify main and backup SMTP servers.
$mail->SMTPAuth = true;         // Enable SMTP authentication


$mail->Username = EMAIL_USER;   // SMTP username
$mail->Password = EMAIL_PASS;   // SMTP password
$mail->SMTPSecure = 'tls';      // Enable TLS encryption, `ssl` also accepted, but TLS is a newer more-secure encryption
$mail->Port = 587;              // TCP port to connect to
$options = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
$mail->smtpConnect($options);
$mail->From = $message['email'];
// $mail->From = EMAIL_USER;  // sender's email address (shows in "From" field)
$mail->FromName = $message['name'];   // sender's name (shows in "From" field)
// $mail->FromName = EMAIL_USERNAME;
$mail->addAddress(EMAIL_TO_ADDRESS);  // Add a recipient
//$mail->addAddress('ellen@example.com');                        // Name is optional
$mail->addReplyTo($message['email'], $message['name']);                          // Add a reply-to address
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');

//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML


if(empty($message['subject'])){
    $message['subject'] = $message['name'] . " has sent you a message from your portfolio.";
};
$mail->Subject = $message['subject'];
$message['message'] = nl2br($message['message']);
$mail->Body    = $message['message'];
$mail->AltBody = htmlentities($message['message']);

if(!$mail->send()) {
    $output['success']= false;
    $output['messages'][] = $mail->ErrorInfo;
	// echo 'Sorry, there was an issue with the server, please try again later.';
	$output['debug'] = $mail->Debugoutput;
    exit();
} else {
    $output['success'] = true;
    echo 'Thanks for your message! I will get back to you as soon as possible.';
    exit();
}

?>
