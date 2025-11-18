'use client'

//alterar import com: add_dieta - dieta - nutri
import ModalEditarPerfil from "@/components/modal-dieta/nutri";
import { useState } from "react";


// alterar function com: addDieta - modalDieta - modalNutri
export default function modalNutri() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button 
        onClick={openModal} 
        className="bg-purple-700 text-white py-2 px-4 rounded-md">
        Abrir Modal
      </button>

      <ModalEditarPerfil isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
