"use client";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import SectionTitle from "@/components/HomePage/sectionTitle";
import { Input, Textarea, Button, Card, CardBody } from "@nextui-org/react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real application, you would send the data to your backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) throw new Error('Failed to submit form');
      
      setSubmitSuccess(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        mensagem: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-7xl pt-16 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="pt-10 sm:pt-20">
          <SectionTitle title="Entre em Contato" />
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4 mb-12 max-w-2xl mx-auto">
            Estamos à disposição para atender suas necessidades. Preencha o formulário abaixo ou utilize um de nossos canais de atendimento.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <Card className="bg-gray-50 dark:bg-zinc-900 border-none shadow-md">
                  <CardBody className="flex flex-row items-center gap-4 p-6">
                    <div className="bg-red-600 p-3 rounded-full">
                      <FaPhone className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Telefone</h3>
                      <p className="text-gray-600 dark:text-gray-400">(19) 3251-0331</p>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-gray-50 dark:bg-zinc-900 border-none shadow-md">
                  <CardBody className="flex flex-row items-center gap-4 p-6">
                    <div className="bg-red-600 p-3 rounded-full">
                      <FaEnvelope className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-400">vendas@akkarmotors.com.br</p>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-gray-50 dark:bg-zinc-900 border-none shadow-md">
                  <CardBody className="flex flex-row items-center gap-4 p-6">
                    <div className="bg-red-600 p-3 rounded-full">
                      <FaMapMarkerAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Endereço</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Av. Orosimbo Maia, 2042<br />
                        Cambuí, Campinas, SP<br />
                        CEP 13024-045
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-md border-none">
                <CardBody>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        type="text"
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        variant="bordered"
                        isRequired
                        classNames={{
                          inputWrapper: "bg-gray-50 dark:bg-zinc-900",
                        }}
                      />
                      <Input
                        type="tel"
                        label="Telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        variant="bordered"
                        isRequired
                        classNames={{
                          inputWrapper: "bg-gray-50 dark:bg-zinc-900",
                        }}
                      />
                    </div>
                    <Input
                      type="email"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                      classNames={{
                        inputWrapper: "bg-gray-50 dark:bg-zinc-900",
                      }}
                    />
                    <Textarea
                      label="Mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      variant="bordered"
                      minRows={4}
                      isRequired
                      classNames={{
                        inputWrapper: "bg-gray-50 dark:bg-zinc-900",
                      }}
                    />
                    
                    {submitSuccess && (
                      <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                        Mensagem enviada com sucesso! Entraremos em contato em breve.
                      </div>
                    )}
                    
                    {submitError && (
                      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                        Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      color="danger"
                      variant="shadow"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <SectionTitle title="Nossa Localização" />
          <div className="mt-8 h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.3506351869654!2d-47.05778492376857!3d-22.90237997919579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c8b5d6c7f8a7%3A0x8c759d4c2a6b9a2e!2sAv.%20Orosimbo%20Maia%2C%202042%20-%20Cambu%C3%AD%2C%20Campinas%20-%20SP%2C%2013024-045!5e0!3m2!1spt-BR!2sbr!4v1708909234567!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 